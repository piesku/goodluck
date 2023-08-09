import {instantiate} from "../../lib/game.js";
import {set_position} from "../components/com_local_transform2d.js";
import {Game, WORLD_CAPACITY} from "../game.js";
import {map_platforms} from "../maps/map_platforms.js";
import {tiled_layer_blueprints} from "../tiled.js";
import {World} from "../world.js";
import {blueprint_camera} from "./blu_camera.js";

export function scene_platforms(game: Game) {
    game.World = new World(WORLD_CAPACITY);
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [
        ...blueprint_camera(game),
        set_position(map_platforms.width / 2, map_platforms.height / 2),
    ]);

    // Map from Tiled.
    for (let layer of map_platforms.layers) {
        for (let blueprint of tiled_layer_blueprints(layer)) {
            instantiate(game, blueprint);
        }
    }
}
