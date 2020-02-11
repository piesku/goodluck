import {Vec3} from "../../common/index.js";
import {from_axis} from "../../common/quat.js";
import {Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Move | Has.PlayerControl;
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
    let control = game.World.PlayerControl[entity];

    if (control.Move) {
        let move = game.World.Move[entity];
        if (game.InputState.KeyW) {
            // Move forward
            move.Directions.push([0, 0, 1]);
        }
        if (game.InputState.KeyA) {
            // Strafe left
            move.Directions.push([1, 0, 0]);
        }
        if (game.InputState.KeyS) {
            // Move backward
            move.Directions.push([0, 0, -1]);
        }
        if (game.InputState.KeyD) {
            // Strafe right
            move.Directions.push([-1, 0, 0]);
        }
    }

    if (control.Yaw) {
        let move = game.World.Move[entity];
        let yaw_delta = game.InputEvent.mouse_x * move.RotateSpeed * delta;
        if (yaw_delta !== 0) {
            move.Yaws.push(from_axis([0, 0, 0, 0], AXIS_Y, -yaw_delta));
        }
    }

    if (control.Pitch) {
        let move = game.World.Move[entity];
        let pitch_delta = game.InputEvent.mouse_y * move.RotateSpeed * delta;
        if (pitch_delta !== 0) {
            move.Pitches.push(from_axis([0, 0, 0, 0], AXIS_X, pitch_delta));
        }
    }
}
