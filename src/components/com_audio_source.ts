import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface AudioSource {
    /** Named clips this source can play. */
    readonly clips: {
        [k: string]: AudioClip;
    };
    /** The name of the next clip to play. */
    trigger?: string;
    /** The clip which was triggered most recently. */
    current?: AudioClip;
    /** The clip to play by default, in a loop. */
    idle?: string;
    /** Elapsed time since the last clip change. */
    time: number;
}

/**
 * Add the AudioSource component.
 *
 * @param clips Named audio clips this source can play.
 * @param idle The name of the clip to play by default, in a loop.
 */
export function audio_source(clips: {[k: string]: AudioClip}, idle?: string) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.AudioSource;
        game[Get.AudioSource][entity] = <AudioSource>{
            clips,
            idle,
            time: 0,
        };
    };
}

export interface AudioClip {
    /** Audio tracks making up this clip. */
    tracks: Array<AudioTrack>;
    /** How soon after starting this clip can we play another one (in seconds)? */
    exit: number;
    /** Beats per minute (default 120). */
    bpm?: number;
}

export interface AudioTrack {
    instrument: Instrument;
    notes: Array<number>;
}

export interface Instrument {
    [InstrumentParam.MasterGainAmount]: number;
    [InstrumentParam.FilterEnabled]: boolean;
    [InstrumentParam.FilterType]: BiquadFilterType;
    [InstrumentParam.FilterFreq]: number;
    [InstrumentParam.FilterQ]: number;
    [InstrumentParam.LFOEnabled]: boolean;
    [InstrumentParam.LFOType]: OscillatorType;
    [InstrumentParam.LFOAmount]: number;
    [InstrumentParam.LFOFreq]: number;
    [InstrumentParam.FilterDetuneLFO]: boolean;
    [InstrumentParam.Sources]: Array<Oscillator | Buffer>;
}

export const enum SourceKind {
    Oscillator,
    Buffer,
}

interface Oscillator {
    [SourceParam.Kind]: SourceKind.Oscillator;
    [SourceParam.GainAmount]: number;
    [SourceParam.GainAttack]: number;
    [SourceParam.GainSustain]: number;
    [SourceParam.GainRelease]: number;
    [SourceParam.OscillatorType]: OscillatorType;
    [SourceParam.DetuneAmount]: number;
    [SourceParam.DetuneLFO]: boolean;
    [SourceParam.FreqEnabled]: boolean;
    [SourceParam.FreqAttack]: number;
    [SourceParam.FreqSustain]: number;
    [SourceParam.FreqRelease]: number;
}

interface Buffer {
    [SourceParam.Kind]: SourceKind.Buffer;
    [SourceParam.GainAmount]: number;
    [SourceParam.GainAttack]: number;
    [SourceParam.GainSustain]: number;
    [SourceParam.GainRelease]: number;
}

export const enum InstrumentParam {
    MasterGainAmount,
    FilterEnabled,
    FilterType,
    FilterFreq,
    FilterQ,
    FilterDetuneLFO,
    LFOEnabled,
    LFOType,
    LFOAmount,
    LFOFreq,
    Sources,
}

export const enum SourceParam {
    Kind,
    GainAmount,
    GainAttack,
    GainSustain,
    GainRelease,
    OscillatorType,
    DetuneAmount,
    DetuneLFO,
    FreqEnabled,
    FreqAttack,
    FreqSustain,
    FreqRelease,
}
