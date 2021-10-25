import {hsva_to_vec4} from "../../common/color.js";
import {instantiate} from "../../common/game.js";
import {from_euler} from "../../common/quat.js";
import {float} from "../../common/random.js";
import {camera_forward_ortho} from "../components/com_camera.js";
import {control_always2d} from "../components/com_control_always2d.js";
import {move2d} from "../components/com_move2d.js";
import {render2d} from "../components/com_render2d.js";
import {transform} from "../components/com_transform.js";
import {Game, WORLD_CAPACITY} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World(WORLD_CAPACITY);
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [transform([0, 0, 2]), camera_forward_ortho(2, 1, 100)]);

    let sprite_count = 50_000;
    for (let i = 0; i < sprite_count; i++) {
        instantiate(game, [
            transform(
                // Place entities on the Z axis from closest to the farthest away
                // to avoid overdraw.
                [float() * 2 - 1, float() * 2 - 1, -i / sprite_count],
                from_euler([0, 0, 0, 1], 0, 0, float() * 360),
                [0.05, 0.05, 1]
            ),
            render2d(hsva_to_vec4(float(), 0.5, 1, 1)),
            move2d(0, 1),
            control_always2d(false, true),
        ]);
    }
}
