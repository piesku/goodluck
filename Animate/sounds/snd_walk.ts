import {AudioClipKind, AudioSynthClip} from "../../common/audio.js";

export let snd_walk: AudioSynthClip = {
    Kind: AudioClipKind.Synth,
    Tracks: [
        {
            Instrument: [8, "lowpass", 11, 0, false, false, 8, 8, [[false, 8, 2, 1, 1]]],
            Notes: [72],
        },
    ],
    Exit: 0.2,
};
