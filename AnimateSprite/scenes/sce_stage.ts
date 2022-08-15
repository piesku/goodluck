import {instantiate} from "../../lib/game.js";
import {animate_sprite} from "../components/com_animate_sprite.js";
import {camera2d} from "../components/com_camera2d.js";
import {draw_arc, draw_rect} from "../components/com_draw.js";
import {local_transform2d} from "../components/com_local_transform2d.js";
import {render2d} from "../components/com_render2d.js";
import {spatial_node2d} from "../components/com_spatial_node2d.js";
import {Game, WORLD_CAPACITY} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World(WORLD_CAPACITY);
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [spatial_node2d(), local_transform2d([0, 0]), camera2d([0, 0])]);

    {
        // Background.
        instantiate(game, [spatial_node2d(), local_transform2d(), draw_rect("#FFD6D5", 16, 16)]);
        instantiate(game, [
            spatial_node2d(),
            local_transform2d([-5, 3], 0),
            draw_arc("#D4FCA9", 7),
        ]);
    }

    // Pot.
    instantiate(game, [
        spatial_node2d(),
        local_transform2d(undefined, 0, [4, 3]),
        render2d("cooking_pot1.png"),
        animate_sprite({
            "cooking_pot1.png": 0.1,
            "cooking_pot2.png": 0.1,
            "cooking_pot3.png": 0.1,
            "cooking_pot4.png": 0.1,
        }),
    ]);
}
