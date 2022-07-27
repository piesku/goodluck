import {hsva_to_vec4} from "../../common/color.js";
import {instantiate} from "../../common/game.js";
import {orthographic} from "../../common/projection.js";
import {element, float} from "../../common/random.js";
import {animate_sprite} from "../components/com_animate_sprite.js";
import {camera_canvas} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {control_always2d} from "../components/com_control_always2d.js";
import {control_player} from "../components/com_control_player.js";
import {draw_arc, draw_rect} from "../components/com_draw.js";
import {move2d} from "../components/com_move2d.js";
import {order, render2d} from "../components/com_render2d.js";
import {RigidKind, rigid_body2d} from "../components/com_rigid_body2d.js";
import {local_transform2d, spatial_node2d} from "../components/com_transform2d.js";
import {Game, WORLD_CAPACITY} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World(WORLD_CAPACITY);
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [
        spatial_node2d(),
        local_transform2d([0, 0]),
        camera_canvas(
            orthographic([game.SceneWidth / 2 + 1, game.SceneHeight / 2 + 1], 1, 3),
            [0, 0, 0, 0]
        ),
    ]);

    {
        // Background.
        instantiate(game, [
            spatial_node2d(),
            local_transform2d(),
            draw_rect(game.SceneWidth, game.SceneHeight, "#FFD6D5"),
        ]);
        instantiate(game, [
            spatial_node2d(),
            local_transform2d([-5, 3], 0),
            draw_arc(7, "#D4FCA9"),
        ]);
        instantiate(game, [
            spatial_node2d(),
            local_transform2d([0, 0], -30, [4, 1]),
            move2d(0, 5),
            control_always2d(null, 1),
            children([spatial_node2d(), local_transform2d([0, 0], 30), draw_rect(5, 5, "#FFAA79")]),
        ]);
    }

    // Pot.
    instantiate(game, [
        spatial_node2d(),
        local_transform2d(undefined, 0, [4, 3]),
        render2d("cooking_pot1.png"),
        order(0),
        animate_sprite({
            "cooking_pot1.png": 0.1,
            "cooking_pot2.png": 0.1,
            "cooking_pot3.png": 0.1,
            "cooking_pot4.png": 0.1,
        }),
    ]);

    let dynamic_count = WORLD_CAPACITY - game.World.Signature.length;

    for (let i = 0; i < dynamic_count; i++) {
        instantiate(game, [
            local_transform2d([float(-10, 10), float(9, 10)], float(-180, 180)),
            control_player(),
            render2d(
                element(["potato_raw.png", "carrot_raw.png"]),
                hsva_to_vec4(float(0.1, 0.2), 0.5, 1, 1)
            ),
            rigid_body2d(RigidKind.Dynamic, float(0.01, 0.02)),
        ]);
    }
}
