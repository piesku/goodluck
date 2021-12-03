import {Vec3} from "../../common/math.js";
import {from_axis, get_pitch, multiply} from "../../common/quat.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
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

function update(game: Game, entity: Entity) {
    let control = game.World.ControlPlayer[entity];

    if (control.Move) {
        let move = game.World.Move[entity];
        if (Math.abs(game.InputDelta["pad0_axis_1"]) > DEAD_ZONE) {
            // Strafe movement.
            move.Direction[0] -= game.InputDelta["pad0_axis_1"];
        }
        if (Math.abs(game.InputDelta["pad0_axis_2"]) > DEAD_ZONE) {
            // Forward movement.
            move.Direction[2] -= game.InputDelta["pad0_axis_2"];
        }
    }

    if (control.Yaw && Math.abs(game.InputDelta["pad0_axis_3"]) > DEAD_ZONE) {
        let move = game.World.Move[entity];
        let amount = game.InputDelta["pad0_axis_3"] * Math.PI;
        // Yaw is applied relative to the entity's local space; the Y axis is
        // not affected by its current orientation.
        multiply(move.LocalRotation, move.LocalRotation, from_axis([0, 0, 0, 1], AXIS_Y, -amount));
    }

    if (control.Pitch && Math.abs(game.InputDelta["pad0_axis_4"]) > DEAD_ZONE) {
        let transform = game.World.Transform[entity];
        let move = game.World.Move[entity];

        let amount = game.InputDelta["pad0_axis_4"] * Math.PI;
        let current_pitch = get_pitch(transform.Rotation);
        if (
            (amount < 0 && current_pitch > control.MinPitch) ||
            (amount > 0 && current_pitch < control.MaxPitch)
        ) {
            // Pitch applied relative to the entity's self space; the X axis is
            // always aligned with its left and right sides.
            multiply(move.SelfRotation, move.SelfRotation, from_axis([0, 0, 0, 1], AXIS_X, amount));
        }
    }
}
