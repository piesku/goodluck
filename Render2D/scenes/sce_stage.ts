import {hsva_to_vec4} from "../../common/color.js";
import {instantiate} from "../../common/game.js";
import {float} from "../../common/random.js";
import {animate_sprite} from "../components/com_animate_sprite.js";
import {camera2d} from "../components/com_camera2d.js";
import {children} from "../components/com_children.js";
import {collide2d} from "../components/com_collide2d.js";
import {control_always2d} from "../components/com_control_always2d.js";
import {control_player} from "../components/com_control_player.js";
import {draw_arc, draw_rect} from "../components/com_draw.js";
import {move2d} from "../components/com_move2d.js";
import {order, render2d} from "../components/com_render2d.js";
import {RigidKind, rigid_body2d} from "../components/com_rigid_body2d.js";
import {local_transform2d, spatial_node2d} from "../components/com_transform2d.js";
import {Game, Layer, WORLD_CAPACITY} from "../game.js";
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
        instantiate(game, [
            spatial_node2d(),
            local_transform2d([0, 0], -30, [4, 1]),
            move2d(0, 5),
            control_always2d(null, 1),
            children([spatial_node2d(), local_transform2d([0, 0], 30), draw_rect("#FFAA79", 5, 5)]),
        ]);
    }

    // Pot.
    instantiate(game, [
        spatial_node2d(),
        local_transform2d(undefined, 0, [4, 3]),
        collide2d(false, Layer.Terrain, Layer.None),
        rigid_body2d(RigidKind.Static),
        render2d("cooking_pot1.png"),
        order(0),
        animate_sprite({
            "cooking_pot1.png": 0.1,
            "cooking_pot2.png": 0.1,
            "cooking_pot3.png": 0.1,
            "cooking_pot4.png": 0.1,
        }),
    ]);

    // Carrots are spatial nodes with dynamic rigid_bodies and dynamic colliders.
    for (let i = 0; i < 32; i++) {
        instantiate(game, [
            spatial_node2d(),
            local_transform2d([float(-10, 10), float(9, 10)], float(-180, 180)),
            collide2d(true, Layer.Object, Layer.Terrain | Layer.Object),
            rigid_body2d(RigidKind.Dynamic, 1, float(0.01, 0.02)),
            control_player(),
            render2d("carrot_raw.png", hsva_to_vec4(float(0.1, 0.2), 0.5, 1, 1)),
            order(0.1),
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
