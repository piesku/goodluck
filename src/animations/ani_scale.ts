import {AnimationClip} from "../components/com_animate.js";
import {ease_in_out_sine} from "../math/easing.js";

export const ani_scale = <AnimationClip>{
    keyframes: [
        {
            timestamp: 0,
            scale: [1, 1, 1],
            ease: ease_in_out_sine,
        },
        {
            timestamp: 1,
            scale: [0.8, 0.8, 0.8],
            ease: ease_in_out_sine,
        },
    ],
};
