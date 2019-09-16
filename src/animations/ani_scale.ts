import {AnimationClip} from "../components/com_animate.js";
import {ease_in_out_sine} from "../math/easing.js";

export const ani_scale = <AnimationClip>{
    Keyframes: [
        {
            Timestamp: 0,
            Scale: [1, 1, 1],
            Ease: ease_in_out_sine,
        },
        {
            Timestamp: 1,
            Scale: [0.8, 0.8, 0.8],
            Ease: ease_in_out_sine,
        },
    ],
};
