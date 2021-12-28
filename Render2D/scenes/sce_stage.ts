import {hsva_to_vec4} from "../../common/color.js";
import {instantiate} from "../../common/game.js";
import {orthographic} from "../../common/projection.js";
import {float} from "../../common/random.js";
import {camera_canvas} from "../components/com_camera.js";
import {control_always2d} from "../components/com_control_always2d.js";
import {control_player} from "../components/com_control_player.js";
import {move2d} from "../components/com_move2d.js";
import {order, render2d} from "../components/com_render2d.js";
import {RigidKind, rigid_body2d} from "../components/com_rigid_body2d.js";
import {transform2d} from "../components/com_transform2d.js";
import {Game, WORLD_CAPACITY} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World(WORLD_CAPACITY);
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [transform2d([0, 0]), camera_canvas(orthographic(5, 1, 3))]);

    let dynamic_count = Math.floor(WORLD_CAPACITY / 2);
    let static_count = Math.floor(WORLD_CAPACITY / 2);

    // dynamic_count = WORLD_CAPACITY - 1;
    // static_count = 0;

    for (let i = 0; i < dynamic_count; i++) {
        instantiate(game, [
            transform2d([float(-20, 20), float(0, -20)], 0),
            render2d(hsva_to_vec4(float(), 0.5, 1, 1)),
            // Place entities from closest to the farthest away to avoid overdraw.
            order(1 - i / dynamic_count),
            rigid_body2d(RigidKind.Dynamic, float(0.95, 0.99)),
            control_player(),
            move2d(0, 30),
            control_always2d(false, 1),
        ]);
    }

    for (let i = 0; i < static_count; i++) {
        let s = float(0.1, 1);
        instantiate(game, [
            transform2d([float(-20, 20), float(1, 20)], 0, [s, s]),
            render2d(hsva_to_vec4(float(), 0.5, 1, 1)),
            order(-i / static_count),
        ]);
    }
}
