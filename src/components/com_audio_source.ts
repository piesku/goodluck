import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface AudioSource {
    /** The next clip to play. */
    Trigger?: AudioClip;
    /** The clip which was triggered most recently. */
    Current?: AudioClip;
    /** The clip to play by default, in a loop. */
    Idle?: AudioClip;
    /** Elapsed time since the last clip change. */
    Time: number;
}

/**
 * Add the AudioSource component.
 *
 * @param idle The name of the clip to play by default, in a loop.
 */
export function audio_source(idle?: AudioClip) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.AudioSource;
        game[Get.AudioSource][entity] = <AudioSource>{
            Idle: idle,
            Time: 0,
        };
    };
}

export interface AudioClip {
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
