import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {from_axis} from "../math/quat.js";

const QUERY = (1 << Get.Move) | (1 << Get.PlayerControl);
const AXIS_X = [1, 0, 0];
const AXIS_Y = [0, 1, 0];

export function sys_control_player(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let control = game[Get.PlayerControl][entity];

    if (control.Move) {
        let move = game[Get.Move][entity];
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
        let move = game[Get.Move][entity];
        let yaw_delta = game.InputEvent.mouse_x * move.RotateSpeed * delta;
        if (yaw_delta !== 0) {
            move.Yaws.push(from_axis([], AXIS_Y, -yaw_delta));
        }
    }

    if (control.Pitch) {
        let move = game[Get.Move][entity];
        let pitch_delta = game.InputEvent.mouse_y * move.RotateSpeed * delta;
        if (pitch_delta !== 0) {
            move.Pitches.push(from_axis([], AXIS_X, pitch_delta));
        }
    }
}
