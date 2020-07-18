import {DEG_TO_RAD, Quat, Vec3} from "../../common/math.js";
import {from_axis, multiply} from "../../common/quat.js";
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

function update(game: Game, entity: Entity) {
    let control = game.World.ControlPlayer[entity];

    if (control.Yaw && game.InputDelta.MouseX) {
        // Scale the mouse input by the sensitivity.
        let amount = game.InputDelta.MouseX * control.Yaw;
        // Treat the pixels traveled by the mouse in this frame as literal Euler
        // angles. This happens to work well and gives the mouse control an
        // instant and precise feel. Note that the rotation won't be passed to
        // sys_move; instead it's applied here and ignores Move.RotationSpeed on
        // purpose.
        from_axis(rotation, AXIS_Y, -amount * DEG_TO_RAD);

        let transform = game.World.Transform[entity];
        // Yaw is pre-multiplied, i.e. applied relative to the entity's local
        // space; the Y axis is not affected by its current orientation.
        multiply(transform.Rotation, rotation, transform.Rotation);
        transform.Dirty = true;
    }

    if (control.Pitch && game.InputDelta.MouseY) {
        let amount = game.InputDelta.MouseY * control.Pitch;
        from_axis(rotation, AXIS_X, amount * DEG_TO_RAD);

        let transform = game.World.Transform[entity];
        // Pitch is post-multiplied, i.e. applied relative to the entity's self
        // space; the X axis is always aligned with its left and right sides.
        multiply(transform.Rotation, transform.Rotation, rotation);
        transform.Dirty = true;
    }
}
