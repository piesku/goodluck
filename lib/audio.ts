import {element} from "./random.js";

export type AudioClip = AudioBufferClip | AudioSynthClip;

export const enum AudioClipKind {
    Buffer,
    Synth,
}

export interface AudioBufferClip {
    Kind: AudioClipKind.Buffer;
    Buffer: AudioBuffer;
    Exit: number;
}

export interface AudioSynthClip {
    Kind: AudioClipKind.Synth;
    /** Audio tracks making up this clip. */
    Tracks: Array<AudioTrack>;
    /** How soon after starting this clip can we play another one (in seconds)? */
    Exit: number;
    /** Beats per minute (default 120). */
    BPM?: number;
}

export interface AudioTrack {
    Instrument: Instrument;
    Notes: Array<number>;
}

export interface Instrument {
    [InstrumentParam.MasterGainAmount]: number;
    [InstrumentParam.FilterType]?: false | BiquadFilterType;
    [InstrumentParam.FilterFreq]?: number;
    [InstrumentParam.FilterQ]?: number;
    [InstrumentParam.FilterDetuneLFO]?: boolean;
    [InstrumentParam.LFOType]?: false | OscillatorType;
    [InstrumentParam.LFOAmount]?: number;
    [InstrumentParam.LFOFreq]?: number;
    [InstrumentParam.Sources]: Array<Oscillator | Buffer>;
}

interface Oscillator {
    [SourceParam.SourceType]: OscillatorType;
    [SourceParam.GainAmount]: number;
    [SourceParam.GainAttack]: number;
    [SourceParam.GainSustain]: number;
    [SourceParam.GainRelease]: number;
    [SourceParam.DetuneAmount]: number;
    [SourceParam.DetuneLFO]?: boolean;
    [SourceParam.FreqEnabled]?: boolean;
    [SourceParam.FreqAttack]?: number;
    [SourceParam.FreqSustain]?: number;
    [SourceParam.FreqRelease]?: number;
}

interface Buffer {
    [SourceParam.SourceType]: false;
    [SourceParam.GainAmount]: number;
    [SourceParam.GainAttack]: number;
    [SourceParam.GainSustain]: number;
    [SourceParam.GainRelease]: number;
}

export const enum InstrumentParam {
    MasterGainAmount,
    FilterType,
    FilterFreq,
    FilterQ,
    FilterDetuneLFO,
    LFOType,
    LFOAmount,
    LFOFreq,
    Sources,
}

export const enum SourceParam {
    SourceType,
    GainAmount,
    GainAttack,
    GainSustain,
    GainRelease,
    DetuneAmount,
    DetuneLFO,
    FreqEnabled,
    FreqAttack,
    FreqSustain,
    FreqRelease,
}

export function play_note(
    audio: AudioContext,
    panner: PannerNode | undefined,
    instr: Instrument,
    note: number,
    offset: number
) {
    let time = audio.currentTime + offset;
    let total_duration = 0;

    if (panner) {
        panner.connect(audio.destination);
    }

    let master = audio.createGain();
    master.gain.value = (instr[InstrumentParam.MasterGainAmount] / 9) ** 3;

    let lfa, lfo;
    if (instr[InstrumentParam.LFOType]) {
        // Frequency is mapped to [0, 125].
        lfo = audio.createOscillator();
        lfo.type = instr[InstrumentParam.LFOType] as OscillatorType;
        lfo.frequency.value = (instr[InstrumentParam.LFOFreq]! / 3) ** 3;

        // Amount is mapped to [27, 5832].
        lfa = audio.createGain();
        lfa.gain.value = (instr[InstrumentParam.LFOAmount]! + 3) ** 3;

        lfo.connect(lfa);
    }

    if (instr[InstrumentParam.FilterType]) {
        let filter = audio.createBiquadFilter();
        filter.type = instr[InstrumentParam.FilterType] as BiquadFilterType;
        filter.frequency.value = 2 ** instr[InstrumentParam.FilterFreq]!;
        filter.Q.value = instr[InstrumentParam.FilterQ]! ** 1.5;
        if (lfa && instr[InstrumentParam.FilterDetuneLFO]) {
            lfa.connect(filter.detune);
        }

        master.connect(filter);
        if (panner) {
            filter.connect(panner);
        } else {
            filter.connect(audio.destination);
        }
    } else if (panner) {
        master.connect(panner);
    } else {
        master.connect(audio.destination);
    }

    for (let source of instr[InstrumentParam.Sources]) {
        let amp = audio.createGain();
        amp.connect(master);

        // Gain Envelope

        let gain_amount = (source[SourceParam.GainAmount] / 9) ** 3;
        let gain_attack = (source[SourceParam.GainAttack] / 9) ** 3;
        let gain_sustain = (source[SourceParam.GainSustain] / 9) ** 3;
        let gain_release = (source[SourceParam.GainRelease] / 6) ** 3;
        let gain_duration = gain_attack + gain_sustain + gain_release;

        amp.gain.setValueAtTime(0, time);
        amp.gain.linearRampToValueAtTime(gain_amount, time + gain_attack);
        amp.gain.setValueAtTime(gain_amount, time + gain_attack + gain_sustain);
        amp.gain.exponentialRampToValueAtTime(0.00001, time + gain_duration);

        // XXX TypeScript doesn't recognize source[SourceParam.SourceType] as the discriminant.
        if (source[0]) {
            let hfo = audio.createOscillator();
            hfo.type = source[SourceParam.SourceType];
            hfo.connect(amp);

            // Detune

            // [-1265,1265] i.e. one octave down and one octave up.
            hfo.detune.value = 3 * (source[SourceParam.DetuneAmount] - 7.5) ** 3;
            if (lfa && source[SourceParam.DetuneLFO]) {
                lfa.connect(hfo.detune);
            }

            // Frequency Envelope

            // Frequency from note number
            let freq = 440 * 2 ** ((note - 69) / 12);
            if (source[SourceParam.FreqEnabled]) {
                let freq_attack = (source[SourceParam.FreqAttack]! / 9) ** 3;
                let freq_sustain = (source[SourceParam.FreqSustain]! / 9) ** 3;
                let freq_release = (source[SourceParam.FreqRelease]! / 6) ** 3;
                hfo.frequency.linearRampToValueAtTime(0, time);
                hfo.frequency.linearRampToValueAtTime(freq, time + freq_attack);
                hfo.frequency.setValueAtTime(freq, time + freq_attack + freq_sustain);
                hfo.frequency.exponentialRampToValueAtTime(
                    0.00001,
                    time + freq_attack + freq_sustain + freq_release
                );
            } else {
                hfo.frequency.setValueAtTime(freq, time);
            }

            hfo.start(time);
            hfo.stop(time + gain_duration);
        } else {
            let noise = audio.createBufferSource();
            noise.buffer = lazy_noise_buffer(audio);
            noise.loop = true;
            noise.connect(amp);

            noise.start(time);
            noise.stop(time + gain_duration);
        }

        if (gain_duration > total_duration) {
            total_duration = gain_duration;
        }
    }

    if (lfo) {
        lfo.start(time);
        lfo.stop(time + total_duration);
    }
}

let noise_buffer: AudioBuffer;
function lazy_noise_buffer(audio: AudioContext) {
    if (!noise_buffer) {
        noise_buffer = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
        let channel = noise_buffer.getChannelData(0);
        for (let i = 0; i < channel.length; i++) {
            channel[i] = Math.random() * 2 - 1;
        }
    }
    return noise_buffer;
}

export function play_synth_clip(
    audio: AudioContext,
    panner: PannerNode | undefined,
    clip: AudioSynthClip
) {
    // Seconds per beat, corresponding to a quarter note.
    let spb = 60 / (clip.BPM || 120);
    // Track timing is based on sixteenth notes.
    let interval = spb / 4;
    for (let track of clip.Tracks) {
        for (let i = 0; i < track.Notes.length; i++) {
            if (track.Notes[i]) {
                play_note(audio, panner, track.Instrument, track.Notes[i], i * interval);
            }
        }
    }
}

export function play_synth_random(
    audio: AudioContext,
    panner: PannerNode | undefined,
    clip: AudioSynthClip
) {
    for (let track of clip.Tracks) {
        let note = element(track.Notes);
        if (note) {
            play_note(audio, panner, track.Instrument, note, 0);
        }
    }
}

export function play_buffer_clip(
    audio: AudioContext,
    panner: PannerNode | undefined,
    clip: AudioBufferClip
) {
    let source = audio.createBufferSource();
    source.buffer = clip.Buffer;

    if (panner) {
        source.connect(panner);
        panner.connect(audio.destination);
    } else {
        source.connect(audio.destination);
    }

    source.start();
}
