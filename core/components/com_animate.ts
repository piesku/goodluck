/**
 * # Animate
 *
 * The `Animate` component is used to animate the transform of the entity over
 * time.
 *
 * Animations are defined as _clips_ using the `AnimationClip` interface. A clip
 * is a collection of `AnimationKeyframes`, which define the local translation,
 * rotation and scale of the entity, relative to the parent, as well as the
 * timestamps at which the keyframe is active.
 *
 * If you want to animate an object defined as a hierarchy of entities, you'll
 * need to add `Animate` to every child of the hierarchy. Each child should then
 * define its own clips, named consistently across all entities in the
 * hierarchy. A control system can then trigger a clip to play on the root
 * entity.
 *
 *     for (let child_entity of query_down(game.World, entity, Has.Animate)) {
 *         let child_animate = game.World.Animate[child_entity];
 *         child_animate.Trigger = "jump";
 *     }
 */

import {Quat, Vec3} from "../../lib/math.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Animate {
    /** Animation states store the state of clips' playback. */
    States: Record<string, AnimationState>;
    /** The clip played currently. Defaults to Anim.Idle. */
    Current: AnimationState;
    /** The clip to play next. */
    Trigger?: "idle" | "walk" | "jump";
}

/**
 * Add `Animate` to an entity.
 *
 *     animate({
 *         "idle": {
 *             Keyframes: [
 *                 {
 *                     Timestamp: 0,
 *                     Translation: [0, 0, 0],
 *                     Ease: ease_in_out_quad,
 *                 },
 *                 {
 *                     Timestamp: 1,
 *                     Translation: [0, 1, 0],
 *                     Ease: ease_in_out_quad,
 *                 },
 *             ],
 *             Flags: AnimationFlags.Loop | AnimationFlags.Alternate,
 *         }
 *     })
 *
 * @param clips Map of named clips; must at least include a clip named `idle`.
 */
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

export interface AnimationClip {
    /** Keyframe definitions. */
    Keyframes: Array<Readonly<AnimationKeyframe>>;
    /** Setting flags. Default is EarlyExit | Loop | Alternate. */
    Flags?: AnimationFlag;
}

export interface AnimationKeyframe {
    Translation?: Vec3;
    Rotation?: Quat;
    Scale?: Vec3;
    Timestamp: number;
    /** Easing function used to transition to this keyframe. */
    Ease?: (t: number) => number;
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

interface AnimationState {
    /** A one-level-deep copy of clip's keyframe definitions. */
    Keyframes: Array<AnimationKeyframe>;
    /** Setting flags. */
    Flags: AnimationFlag;
    /** Total duration of the clip, calculated from the last keyframe. */
    Duration: number;
    /** Current playback timestamp. */
    Time: number;
}
