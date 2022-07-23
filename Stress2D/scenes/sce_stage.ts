import {hsva_to_vec4} from "../../common/color.js";
import {instantiate} from "../../common/game.js";
import {orthographic} from "../../common/projection.js";
import {float} from "../../common/random.js";
import {camera_canvas} from "../components/com_camera.js";
import {control_player} from "../components/com_control_player.js";
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

    let dynamic_count = 100_000;

    for (let i = 0; i < dynamic_count; i++) {
        instantiate(game, [
            transform2d([float(-10, 10), float(9, 10)], 0),
            control_player(),
            render2d("potato_raw.png", hsva_to_vec4(float(0.1, 0.2), 0.5, 1, 1)),
            // Place entities from closest to the farthest away to avoid overdraw.
            order(1 - i / dynamic_count),
            rigid_body2d(RigidKind.Dynamic, float(0.98, 0.99)),
        ]);
    }
}
