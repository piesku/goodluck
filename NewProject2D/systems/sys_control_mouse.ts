import {instantiate} from "../../lib/game.js";
import {pointer_down, pointer_viewport} from "../../lib/input.js";
import {Vec2} from "../../lib/math.js";
import {viewport_to_world} from "../components/com_camera2d.js";
import {copy_position} from "../components/com_local_transform2d.js";
import {Game} from "../game.js";
import {blueprint_square} from "../scenes/blu_square.js";

const SPAWN_INTERVAL = 0.1;
let time_since_last_spawn = 0;
const pointer_position: Vec2 = [0, 0];

export function sys_control_mouse(game: Game, delta: number) {
    let camera_entity = game.Cameras[0];
    if (camera_entity === undefined) {
        return;
    }

    time_since_last_spawn += delta;
    if (time_since_last_spawn > SPAWN_INTERVAL) {
        if (pointer_viewport(game, pointer_position) && pointer_down(game, 0)) {
            let camera = game.World.Camera2D[camera_entity];
            viewport_to_world(pointer_position, camera, pointer_position);
            instantiate(game, [...blueprint_square(game), copy_position(pointer_position)]);
            time_since_last_spawn = 0;
        }
    }
}
