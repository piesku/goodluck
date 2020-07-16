import {DEG_TO_RAD, Quat, Vec3} from "../../common/math.js";
import {from_axis, get_axis, multiply} from "../../common/quat.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Move | Has.ControlPlayer;
const AXIS_X: Vec3 = [1, 0, 0];
const AXIS_Y: Vec3 = [0, 1, 0];

export function sys_control_mouse(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

let rotation: Quat = [0, 0, 0, 0];
let axis: Vec3 = [0, 0, 0];

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
        from_axis(rotation, AXIS_Y, -amount);

        // Yaw is pre-multiplied, i.e. applied relative to the entity's local
        // space; the Y axis is not affected by its current orientation.
        multiply(transform.Rotation, rotation, transform.Rotation);
        transform.Dirty = true;
    } else if (control.Pitch && game.InputDelta.MouseY) {
        let amount = game.InputDelta.MouseY * control.Pitch * DEG_TO_RAD;
        // The angle returned by get_axis_angle is always positive. The
        // direction of the rotation is indicated by the axis: [1, 0, 0] for
        // looking down and [-1, 0, 0] for looking up. The x component of the
        // axis may not be exactly 1 or -1, but it's close enough that we can
        // just multiply by it as if it was Math.sign.
        let current_pitch = get_axis(axis, transform.Rotation);
        let new_pitch = current_pitch * axis[0] + amount;
        if (-0.2 < new_pitch && new_pitch < Math.PI / 2.2) {
            from_axis(rotation, AXIS_X, amount);

            // Pitch is post-multiplied, i.e. applied relative to the entity's self
            // space; the X axis is always aligned with its left and right sides.
            multiply(transform.Rotation, transform.Rotation, rotation);
            transform.Dirty = true;
        }
    }
}
