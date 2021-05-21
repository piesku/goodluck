import {AudioClipKind, AudioSynthClip} from "../../common/audio.js";

export let snd_jump: AudioSynthClip = {
    Kind: AudioClipKind.Synth,
    Tracks: [
        {
            Instrument: [
                8,
                false,
                7,
                8,
                false,
                false,
                8,
                8,
                [
                    ["triangle", 8, 8, 8, 6, 8, false, true, 2, 3, 7],
                    ["square", 3, 1, 2, 2, 8, false, false, 0, 0, 0],
                ],
            ],
            Notes: [72],
        },
    ],
    Exit: 0.4,
};
