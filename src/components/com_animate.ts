import {Entity, Game} from "../game.js";
import {Quat, Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface Animate {
    /** Animation states store the state of clips' playback. */
    readonly states: {
        /** The idle animation is required. */
        idle: AnimationState;
        [k: string]: AnimationState;
    };
    /** The clip played currently. Defaults to "idle". */
    current: AnimationState;
    /** The name of the clip to play next. */
    trigger?: string;
}

export function animate(clips: {idle: AnimationClip; [k: string]: AnimationClip}) {
    return (game: Game) => (entity: Entity) => {
        let states: Record<string, AnimationState> = {};
        for (let name in clips) {
            let {keyframes, flags = AnimationFlag.Default} = clips[name];
            let duration = keyframes[keyframes.length - 1].timestamp;
            states[name] = <AnimationState>{
                // One-level-deep copy of the clip's keyframes. When
                // AnimationFlag.Alternate is set, sys_animate recalculates
                // keyframes' timestamps after each alternation. We want to
                // modify copies of the timestamps defined in the clip. It's OK
                // to copy other keyframe properties by reference.
                keyframes: keyframes.map(keyframe => <AnimationKeyframe>{...keyframe}),
                flags,
                duration,
                time: 0,
            };
        }
        game.world[entity] |= 1 << Get.Animate;
        game[Get.Animate][entity] = <Animate>{
            states,
            current: states["idle"],
        };
    };
}

export interface AnimationKeyframe {
    readonly translation?: Vec3;
    readonly rotation?: Quat;
    readonly scale?: Vec3;
    timestamp: number;
    /** Easing function used to transition to this keyframe. */
    readonly ease?: (t: number) => number;
}

export const enum AnimationFlag {
    /** Run the clip forward once, without early exits. */
    None = 0,
    /** Allow early exits from this clip. */
    EarlyExit = 1 << 0,
    /** Loop the clip from the start. */
    Loop = 1 << 1,
    /** When restarting, alternate the clip's direction. */
    Alternate = 1 << 2,
    /** The default setting used when flags is not defined on the clip. */
    Default = EarlyExit | Loop | Alternate,
}

export interface AnimationClip {
    /** Keyframe definitions. */
    readonly keyframes: Array<Readonly<AnimationKeyframe>>;
    /** Setting flags. Default is EarlyExit | Loop | Alternate. */
    readonly flags?: AnimationFlag;
}

export interface AnimationState {
    /** A one-level-deep copy of clip's keyframe definitions. */
    keyframes: Array<AnimationKeyframe>;
    /** Setting flags. */
    flags: AnimationFlag;
    /** Total duration of the clip, calculated from the last keyframe. */
    duration: number;
    /** Current playback timestamp. */
    time: number;
}
