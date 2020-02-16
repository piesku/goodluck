import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_flame} from "../blueprints/blu_flame.js";
import {light} from "../components/com_light.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Cameras = [];
    game.Lights = [];
    game.GL.clearColor(1, 0.3, 0.3, 1);

    // Camera.
    instantiate(game, {
        Translation: [1, 1, 10],
        ...blueprint_camera(game),
    });

    // Light.
    instantiate(game, {
        Translation: [3, 3, 5],
        Using: [light([1, 1, 1], 6)],
    });

    // Flame.
    instantiate(game, {
        Translation: [0, 0, 0],
        ...blueprint_flame(game),
    });
}
