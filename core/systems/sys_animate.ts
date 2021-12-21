/**
 * @module systems/sys_animate
 */

import {slerp} from "../../common/quat.js";
import {lerp} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
import {AnimationFlag, AnimationKeyframe} from "../components/com_animate.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Animate;

export function sys_animate(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform[entity];
    let animate = game.World.Animate[entity];

    // 1. Switch to the trigger if the clip has completed or early exits are allowed.

    if (animate.Trigger) {
        let next = animate.States[animate.Trigger];
        if (next && next !== animate.Current) {
            if (animate.Current.Time === 0) {
                // If the current clip has completed last frame, switch to the trigger.
                animate.Current = next;
            } else if (animate.Current.Flags & AnimationFlag.EarlyExit) {
                // If the current clip allows early exits, reset its timer so
                // that the next time it plays it starts from the beginning,
                // and then switch to the trigger.
                animate.Current.Time = 0;
                animate.Current = next;
            }
        }
        animate.Trigger = undefined;
    }

    // 2. Find the current and the next keyframe.

    let current_keyframe: AnimationKeyframe | null = null;
    let next_keyframe: AnimationKeyframe | null = null;
    for (let keyframe of animate.Current.Keyframes) {
        if (animate.Current.Time < keyframe.Timestamp) {
            next_keyframe = keyframe;
            break;
        } else {
            current_keyframe = keyframe;
        }
    }

    // 3. Interpolate transform properties between keyframes.

    if (current_keyframe && next_keyframe) {
        let keyframe_duration = next_keyframe.Timestamp - current_keyframe.Timestamp;
        let current_keyframe_time = animate.Current.Time - current_keyframe.Timestamp;
        let interpolant = current_keyframe_time / keyframe_duration;
        if (next_keyframe.Ease) {
            interpolant = next_keyframe.Ease(interpolant);
        }

        if (current_keyframe.Translation && next_keyframe.Translation) {
            lerp(
                transform.Translation,
                current_keyframe.Translation,
                next_keyframe.Translation,
                interpolant
            );
            game.World.Signature[entity] |= Has.Dirty;
        }

        if (current_keyframe.Rotation && next_keyframe.Rotation) {
            slerp(
                transform.Rotation,
                current_keyframe.Rotation,
                next_keyframe.Rotation,
                interpolant
            );
            game.World.Signature[entity] |= Has.Dirty;
        }

        if (current_keyframe.Scale && next_keyframe.Scale) {
            lerp(transform.Scale, current_keyframe.Scale, next_keyframe.Scale, interpolant);
            game.World.Signature[entity] |= Has.Dirty;
        }
    }

    // 4. Check if the animation is still running.

    let new_time = animate.Current.Time + delta;
    if (new_time < animate.Current.Duration) {
        // The animation isn't done yet; continue.
        animate.Current.Time = new_time;
        return;
    } else {
        // The animation has completed; reset its timer.
        animate.Current.Time = 0;
    }

    // 5. The animation has completed. Loop it or switch to idle.

    if (animate.Current.Flags & AnimationFlag.Alternate) {
        // Reverse the keyframes of the clip and recalculate their timestamps.
        for (let keyframe of animate.Current.Keyframes.reverse()) {
            keyframe.Timestamp = animate.Current.Duration - keyframe.Timestamp;
        }
    }

    if (!(animate.Current.Flags & AnimationFlag.Loop)) {
        animate.Current = animate.States["idle"];
    }
}
