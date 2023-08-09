import {instantiate} from "../../lib/game.js";
import {float} from "../../lib/random.js";
import {children} from "../components/com_children.js";
import {collide2d} from "../components/com_collide2d.js";
import {control_always2d} from "../components/com_control_always2d.js";
import {draw_arc, draw_rect} from "../components/com_draw.js";
import {local_transform2d, set_position} from "../components/com_local_transform2d.js";
import {move2d} from "../components/com_move2d.js";
import {RigidKind, rigid_body2d} from "../components/com_rigid_body2d.js";
import {spatial_node2d} from "../components/com_spatial_node2d.js";
import {Game, Layer, WORLD_CAPACITY} from "../game.js";
import {World} from "../world.js";
import {blueprint_camera} from "./blu_camera.js";
import {blueprint_square} from "./blu_square.js";

export function scene_stage(game: Game) {
    game.World = new World(WORLD_CAPACITY);
    game.ViewportResized = true;

    // Camera.
    instantiate(game, blueprint_camera(game));

    {
        // Background.
        instantiate(game, [
            spatial_node2d(),
            local_transform2d(),
            draw_rect("#FFD6D5", game.World.Width, game.World.Height),
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

    // Platforms.
    for (let i = 0; i < 10; i++) {
        let x = float(-game.World.Width / 2, game.World.Width / 2);
        let y = float(-game.World.Height / 2, game.World.Height / 2);
        instantiate(game, [
            spatial_node2d(),
            local_transform2d([x, y], 0, [4, 1]),
            collide2d(false, Layer.Terrain, Layer.None, [4, 1]),
            rigid_body2d(RigidKind.Static),
            draw_rect("green"),
        ]);
    }

    // Square.
    instantiate(game, [...blueprint_square(game), set_position(0, 5)]);
}
