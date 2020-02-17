import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_flame} from "../blueprints/blu_flame.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Cameras = [];
    game.GL.clearColor(1, 0.3, 0.3, 1);

    // Camera.
    instantiate(game, {
        Translation: [0, 3, 10],
        ...blueprint_camera(game),
    });

    // Flame.
    instantiate(game, {
        Scale: [5, 1, 1],
        ...blueprint_flame(game),
    });
}
