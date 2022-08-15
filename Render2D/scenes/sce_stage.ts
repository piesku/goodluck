import {hsva_to_vec4} from "../../lib/color.js";
import {instantiate} from "../../lib/game.js";
import {float} from "../../lib/random.js";
import {camera2d} from "../components/com_camera2d.js";
import {control_player} from "../components/com_control_player.js";
import {draw_arc, draw_rect} from "../components/com_draw.js";
import {local_transform2d} from "../components/com_local_transform2d.js";
import {order, render2d} from "../components/com_render2d.js";
import {RigidKind, rigid_body2d} from "../components/com_rigid_body2d.js";
import {spatial_node2d} from "../components/com_spatial_node2d.js";
import {Game, WORLD_CAPACITY} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World(WORLD_CAPACITY);
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [
        spatial_node2d(),
        local_transform2d([0, 0]),
        camera2d([game.SceneWidth / 2 + 1, game.SceneHeight / 2 + 1]),
    ]);

    {
        // Background.
        instantiate(game, [
            spatial_node2d(),
            local_transform2d(),
            draw_rect("#FFD6D5", game.SceneWidth, game.SceneHeight),
        ]);
        instantiate(game, [
            spatial_node2d(),
            local_transform2d([-5, 3], 0),
            draw_arc("#D4FCA9", 7),
        ]);
    }

    // Potatos are particles with dynamic rigid_bodies.
    let dynamic_count = WORLD_CAPACITY - game.World.Signature.length;
    for (let i = 0; i < dynamic_count; i++) {
        instantiate(game, [
            local_transform2d([float(-10, 10), float(9, 10)], float(-180, 180)),
            control_player(),
            render2d("potato_raw.png", hsva_to_vec4(float(0.1, 0.2), 0.5, 1, 1)),
            order(0.1),
            rigid_body2d(RigidKind.Dynamic, float(0.5, 1.1), float(0.01, 0.02)),
        ]);
    }
}
