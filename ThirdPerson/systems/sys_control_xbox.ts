import {Vec3} from "../../common/math.js";
import {from_axis, get_axis} from "../../common/quat.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Move | Has.ControlPlayer;
const AXIS_Y: Vec3 = [0, 1, 0];
const AXIS_X: Vec3 = [1, 0, 0];
const DEAD_ZONE = 0.1;

export function sys_control_xbox(game: Game, delta: number) {
    for (let pad of navigator.getGamepads()) {
        if (pad) {
            game.InputDelta[`pad${pad.index}_axis_1`] = pad.axes[0];
            game.InputDelta[`pad${pad.index}_axis_2`] = pad.axes[1];
            game.InputDelta[`pad${pad.index}_axis_3`] = pad.axes[2];
            game.InputDelta[`pad${pad.index}_axis_4`] = pad.axes[3];
        }
    }

    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

let axis: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity) {
    let control = game.World.ControlPlayer[entity];

    if (control.Move) {
        let move = game.World.Move[entity];
        if (Math.abs(game.InputDelta["pad0_axis_1"]) > DEAD_ZONE) {
            // Strafe movement.
            move.Directions.push([-game.InputDelta["pad0_axis_1"], 0, 0]);
        }
        if (Math.abs(game.InputDelta["pad0_axis_2"]) > DEAD_ZONE) {
            // Forward movement.
            move.Directions.push([0, 0, -game.InputDelta["pad0_axis_2"]]);
        }
    }

    if (control.Yaw && Math.abs(game.InputDelta["pad0_axis_3"]) > DEAD_ZONE) {
        let move = game.World.Move[entity];
        let amount = game.InputDelta["pad0_axis_3"] * Math.PI;
        // Yaw is applied relative to the entity's local space; the Y axis is
        // not affected by its current orientation.
        move.LocalRotations.push(from_axis([0, 0, 0, 0], AXIS_Y, -amount));
    } else if (control.Pitch && Math.abs(game.InputDelta["pad0_axis_4"]) > DEAD_ZONE) {
        let transform = game.World.Transform[entity];
        let move = game.World.Move[entity];
        let amount = game.InputDelta["pad0_axis_4"] * Math.PI;
        // The angle returned by get_axis_angle is always positive. The
        // direction of the rotation is indicated by the axis: [1, 0, 0] for
        // looking down and [-1, 0, 0] for looking up. The x component of the
        // axis may not be exactly 1 or -1, but it's close enough that we can
        // just multiply by it as if it was Math.sign.
        let current_pitch = get_axis(axis, transform.Rotation);
        current_pitch *= axis[0];
        if ((amount < 0 && current_pitch > -0.2) || (amount > 0 && current_pitch < Math.PI / 2.2)) {
            // Pitch applied relative to the entity's self space; the X axis is
            // always aligned with its left and right sides.
            move.SelfRotations.push(from_axis([0, 0, 0, 0], AXIS_X, amount));
        }
    }
}
