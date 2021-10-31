import {hsva_to_vec4} from "../../common/color.js";
import {instantiate} from "../../common/game.js";
import {float} from "../../common/random.js";
import {camera_forward_ortho} from "../components/com_camera.js";
import {control_always2d} from "../components/com_control_always2d.js";
import {move2d} from "../components/com_move2d.js";
import {order, render2d} from "../components/com_render2d.js";
import {transform} from "../components/com_transform.js";
import {transform2d} from "../components/com_transform2d.js";
import {Game, WORLD_CAPACITY} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World(WORLD_CAPACITY);
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [transform([0, 0, 2]), camera_forward_ortho(2, 1, 100)]);

    let dynamic_count = Math.floor(WORLD_CAPACITY / 2);
    let static_count = Math.floor(WORLD_CAPACITY / 2);

    for (let i = 0; i < dynamic_count; i++) {
        let s = float(0, 0.1);
        instantiate(game, [
            transform2d([float() * 2 - 1, float() * 2 - 1], float() * Math.PI * 2, [s, s]),
            render2d(hsva_to_vec4(float(), 0.5, 1, 1)),
            // Place entities on the Z axis from closest to the farthest away to avoid overdraw.
            order(-i / dynamic_count),
            move2d(0, 1),
            control_always2d(false, 1),
        ]);
    }

    for (let i = 0; i < static_count; i++) {
        instantiate(game, [
            transform2d([float() * 2 - 1, float() * 2 - 1], float() * Math.PI * 2, [0.05, 0.05]),
            render2d(hsva_to_vec4(float(), 0.5, 1, 1)),
            order(-i / static_count - 1),
        ]);
    }
}
