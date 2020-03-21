import {blueprint_box} from "../blueprints/blu_box.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional} from "../components/com_light.js";
import {rotate} from "../components/com_rotate.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.GL.clearColor(1, 1, 1, 1);

    // Camera.
    instantiate(game, {
        Translation: [0, 0, 10],
        ...blueprint_camera(game),
    });

    // Light.
    instantiate(game, {
        Translation: [0, 10, 0],
        Using: [light_directional([1, 1, 1], 1)],
    });

    instantiate(game, {
        Using: [rotate([10, 20, 30])],
        Children: [
            {
                Translation: [0, 4, 0],
                ...blueprint_box(game),
            },
        ],
    });
}
