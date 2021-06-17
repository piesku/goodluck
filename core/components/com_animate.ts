/**
 * @module components/com_animate
 */

import {Quat, Vec3} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Animate {
    /** Animation states store the state of clips' playback. */
    readonly States: Record<string, AnimationState>;
    /** The clip played currently. Defaults to Anim.Idle. */
    Current: AnimationState;
    /** The clip to play next. */
    Trigger?: "idle" | "walk" | "jump";
}

export function animate(clips: {idle: AnimationClip; [k: string]: AnimationClip}) {
    return (game: Game, entity: Entity) => {
        let States: Record<string, AnimationState> = {};
        for (let name in clips) {
            let {Keyframes, Flags = AnimationFlag.Default} = clips[name];
            let duration = Keyframes[Keyframes.length - 1].Timestamp;
            States[name] = {
                // One-level-deep copy of the clip's keyframes. When
                // AnimationFlag.Alternate is set, sys_animate recalculates
                // keyframes' timestamps after each alternation. We want to
                // modify copies of the timestamps defined in the clip. It's OK
                // to copy other keyframe properties by reference.
                Keyframes: Keyframes.map((keyframe) => ({...keyframe})),
                Flags,
                Duration: duration,
                Time: 0,
            };
        }
        game.World.Signature[entity] |= Has.Animate;
        game.World.Animate[entity] = {
            States,
            Current: States["idle"],
        };
    };
}

export interface AnimationKeyframe {
    readonly Translation?: Vec3;
    readonly Rotation?: Quat;
    readonly Scale?: Vec3;
    Timestamp: number;
    /** Easing function used to transition to this keyframe. */
    readonly Ease?: (t: number) => number;
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
    readonly Keyframes: Array<Readonly<AnimationKeyframe>>;
    /** Setting flags. Default is EarlyExit | Loop | Alternate. */
    readonly Flags?: AnimationFlag;
}

export interface AnimationState {
    /** A one-level-deep copy of clip's keyframe definitions. */
    Keyframes: Array<AnimationKeyframe>;
    /** Setting flags. */
    Flags: AnimationFlag;
    /** Total duration of the clip, calculated from the last keyframe. */
    Duration: number;
    /** Current playback timestamp. */
    Time: number;
}
