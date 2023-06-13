/**
 * # sys_control_mouse_move
 *
 * Handle mouse input when the mouse is moving without any buttons pressed. Good
 * for FPS and TPS camera controls.
 */

import {DEG_TO_RAD, Quat, Vec3} from "../../lib/math.js";
import {clamp} from "../../lib/number.js";
import {quat_from_axis, quat_get_pitch, quat_multiply} from "../../lib/quat.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Move | Has.ControlPlayer;
const AXIS_X: Vec3 = [1, 0, 0];
const AXIS_Y: Vec3 = [0, 1, 0];

export function sys_control_mouse_move(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

const rotation: Quat = [0, 0, 0, 0];

function update(game: Game, entity: Entity) {
    let control = game.World.ControlPlayer[entity];
    let transform = game.World.Transform[entity];

    if (control.Yaw && game.InputDelta.MouseX) {
        // Scale the mouse input by the sensitivity.
        let amount = game.InputDelta.MouseX * control.Yaw * DEG_TO_RAD;
        // Treat the pixels traveled by the mouse in this frame as literal Euler
        // angles. This happens to work well and gives the mouse control an
        // instant and precise feel. Note that the rotation won't be passed to
        // sys_move; instead it's applied here and ignores Move.RotationSpeed on
        // purpose.
        quat_from_axis(rotation, AXIS_Y, -amount);

        // Yaw is pre-multiplied, i.e. applied relative to the entity's local
        // space; the Y axis is not affected by its current orientation.
        quat_multiply(transform.Rotation, rotation, transform.Rotation);
        game.World.Signature[entity] |= Has.Dirty;
    }

    if (control.Pitch && game.InputDelta.MouseY) {
        let current_pitch = quat_get_pitch(transform.Rotation);
        let min_amount = control.MinPitch - current_pitch;
        let max_amount = control.MaxPitch - current_pitch;

        let amount = clamp(min_amount, max_amount, game.InputDelta.MouseY * control.Pitch);
        quat_from_axis(rotation, AXIS_X, amount * DEG_TO_RAD);
        // Pitch is post-multiplied, i.e. applied relative to the entity's self
        // space; the X axis is always aligned with its left and right sides.
        quat_multiply(transform.Rotation, transform.Rotation, rotation);
        game.World.Signature[entity] |= Has.Dirty;
    }
}
