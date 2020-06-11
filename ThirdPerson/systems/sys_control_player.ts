import {Vec3} from "../../common/math.js";
import {from_axis} from "../../common/quat.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Move | Has.ControlPlayer;
const AXIS_X = <Vec3>[1, 0, 0];
const AXIS_Y = <Vec3>[0, 1, 0];

export function sys_control_player(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let control = game.World.ControlPlayer[entity];

    if (control.Move) {
        let move = game.World.Move[entity];
        if (game.InputState["KeyW"]) {
            // Move forward
            move.Directions.push([0, 0, 1]);
        }
        if (game.InputState["KeyA"]) {
            // Strafe left
            move.Directions.push([1, 0, 0]);
        }
        if (game.InputState["KeyS"]) {
            // Move backward
            move.Directions.push([0, 0, -1]);
        }
        if (game.InputState["KeyD"]) {
            // Strafe right
            move.Directions.push([-1, 0, 0]);
        }
    }

    if (control.Yaw && game.InputDelta.MouseX) {
        let yaw_delta = game.InputDelta.MouseX * control.Yaw * delta;
        if (yaw_delta !== 0) {
            let move = game.World.Move[entity];
            // Yaw is applied relative to the entity's local space, so that the
            // Y axis is not affected by its current orientation.
            move.LocalRotations.push(from_axis([0, 0, 0, 0], AXIS_Y, -yaw_delta));
        }
    }

    if (control.Pitch && game.InputDelta.MouseY) {
        let pitch_delta = game.InputDelta.MouseY * control.Pitch * delta;
        if (pitch_delta !== 0) {
            let new_pitch = control.CurrentPitch + pitch_delta;
            if (-0.2 < new_pitch && new_pitch < Math.PI / 2) {
                let move = game.World.Move[entity];
                control.CurrentPitch = new_pitch;
                // Pitch is applied relative to the entity's self space, so that the
                // X axis is always aligned with its left and right sides.
                move.SelfRotations.push(from_axis([0, 0, 0, 0], AXIS_X, pitch_delta));
            }
        }
    }
}
