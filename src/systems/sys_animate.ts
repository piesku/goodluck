import {AnimationFlag, AnimationKeyframe} from "../components/com_animate.js";
import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {slerp} from "../math/quat.js";
import {lerp} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Animate);

export function sys_animate(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game[Get.Transform][entity];
    let animate = game[Get.Animate][entity];

    // 1. Switch to the trigger this frame if early exits are allowed.

    let next = animate.trigger && animate.states[animate.trigger];
    if (next && animate.current.flags & AnimationFlag.EarlyExit) {
        // We don't reset the current state's timer because the trigger may be
        // the same state as the current. If the states are different, this may
        // result in clips not starting from the first keyframe, which should
        // be generally OK for animations with EarlyExit.
        animate.current = next;
        animate.trigger = undefined;
    }

    // 2. Find the current and the next keyframe.

    let current_keyframe: AnimationKeyframe | null = null;
    let next_keyframe: AnimationKeyframe | null = null;
    for (let keyframe of animate.current.keyframes) {
        if (animate.current.time < keyframe.timestamp) {
            next_keyframe = keyframe;
            break;
        } else {
            current_keyframe = keyframe;
        }
    }

    // 3. Interpolate transform properties between keyframes.

    if (current_keyframe && next_keyframe) {
        let keyframe_duration = next_keyframe.timestamp - current_keyframe.timestamp;
        let current_keyframe_time = animate.current.time - current_keyframe.timestamp;
        let interpolant = current_keyframe_time / keyframe_duration;
        if (next_keyframe.ease) {
            interpolant = next_keyframe.ease(interpolant);
        }

        if (current_keyframe.translation && next_keyframe.translation) {
            lerp(
                transform.translation,
                current_keyframe.translation,
                next_keyframe.translation,
                interpolant
            );
            transform.dirty = true;
        }

        if (current_keyframe.rotation && next_keyframe.rotation) {
            slerp(
                transform.rotation,
                current_keyframe.rotation,
                next_keyframe.rotation,
                interpolant
            );
            transform.dirty = true;
        }

        if (current_keyframe.scale && next_keyframe.scale) {
            lerp(transform.scale, current_keyframe.scale, next_keyframe.scale, interpolant);
            transform.dirty = true;
        }
    }

    // 4. Check if the animation is still running.

    let new_time = animate.current.time + delta;
    if (new_time < animate.current.duration) {
        // The animation isn't done yet; continue.
        animate.current.time = new_time;
        return;
    } else {
        // The animation has completed; reset its timer.
        animate.current.time = 0;
    }

    // 5. The animation has completed. Determine what to do next.

    if (animate.current.flags & AnimationFlag.Alternate) {
        // Reverse the keyframes of the clip and recalculate their timestamps.
        for (let keyframe of animate.current.keyframes.reverse()) {
            keyframe.timestamp = animate.current.duration - keyframe.timestamp;
        }
    }

    if (next) {
        // Switch to the trigger. All clips can be exited from when they finish,
        // regardless of the lack of the EarlyExit flag. The trigger may be the
        // same state as the current.
        animate.current = next;
        animate.trigger = undefined;
    } else if (!(animate.current.flags & AnimationFlag.Loop)) {
        animate.current = animate.states.idle;
    }
}
