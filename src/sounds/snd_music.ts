import {AudioClip} from "../components/com_audio_source";

export let snd_music = <AudioClip>{
    tracks: [
        {
            instrument: [
                7,
                false,
                "lowpass",
                8,
                8,
                false,
                false,
                "sine",
                8,
                8,
                [
                    [0, 7, 1, 1, 4, "sine", 7, false, false, 7, 7, 7],
                    [0, 1, 1, 1, 6, "sine", 7, false, false, 7, 7, 7],
                ],
            ],
            notes: [72, , , , 74, , , , 72],
        },
    ],
    exit: 2,
};
