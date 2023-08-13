import {instantiate} from "../../lib/game.js";
import {children} from "../components/com_children.js";
import {control_always2d} from "../components/com_control_always2d.js";
import {draw_arc, draw_rect} from "../components/com_draw.js";
import {local_transform2d, set_position, set_scale} from "../components/com_local_transform2d.js";
import {move2d} from "../components/com_move2d.js";
import {spatial_node2d} from "../components/com_spatial_node2d.js";
import {Game, WORLD_CAPACITY} from "../game.js";
import {map_platforms} from "../maps/map_platforms.js";
import {tiled_layer_blueprints} from "../tiled.js";
import {World} from "../world.js";
import {blueprint_camera} from "./blu_camera.js";
import {blueprint_player} from "./blu_player.js";

export function scene_platforms(game: Game) {
    game.ViewportResized = true;

    game.World = new World(WORLD_CAPACITY);
    game.World.BackgroundColor = map_platforms.BackgroundColor;
    game.World.Width = map_platforms.Width;
    game.World.Height = map_platforms.Height;

    // Camera.
    instantiate(game, [
        ...blueprint_camera(game),
        set_position(map_platforms.Width / 2, map_platforms.Height / 2),
    ]);

    {
        // Background.
        instantiate(game, [
            spatial_node2d(),
            local_transform2d(),
            set_position(map_platforms.Width / 2, map_platforms.Height / 2),
            draw_rect("#FFD6D5", game.World.Width, game.World.Height),
        ]);
        instantiate(game, [
            spatial_node2d(),
            local_transform2d([map_platforms.Width / 5, (map_platforms.Height / 5) * 4], 0),
            draw_arc("#D4FCA9", 7),
        ]);
        instantiate(game, [
            spatial_node2d(),
            local_transform2d([map_platforms.Width / 2, map_platforms.Height / 2], -30, [4, 1]),
            move2d(0, 5),
            control_always2d(null, 1),
            children([spatial_node2d(), local_transform2d([0, 0], 30), draw_rect("#FFAA79", 5, 5)]),
        ]);
    }

    // Map from Tiled.
    for (let layer of map_platforms.Layers) {
        for (let blueprint of tiled_layer_blueprints(layer)) {
            instantiate(game, blueprint);
        }
    }

    // Player.
    instantiate(game, [...blueprint_player(game), set_position(0.5, 7), set_scale(-1.5, 1.5)]);
}
