import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light} from "../components/com_light.js";
import {render_shaded} from "../components/com_render_shaded.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Cameras = [];
    game.Lights = [];
    game.Resized = true;
    game.GL.clearColor(1, 0.3, 0.3, 1);

    // Camera.
    instantiate(game, {
        Translation: [1, 2, 5],
        ...blueprint_camera(game),
    });

    // Light.
    instantiate(game, {
        Translation: [2, 3, 5],
        Using: [light([1, 1, 1], 5)],
    });

    // Ground.
    instantiate(game, {
        Translation: [0, 0, 0],
        Scale: [10, 1, 10],
        Using: [render_shaded(game.MaterialGouraud, game.MeshCube, [1, 1, 0.3, 1])],
    });

    // Box.
    instantiate(game, {
        Translation: [0, 1, 0],
        Using: [render_shaded(game.MaterialGouraud, game.MeshCube, [1, 1, 0.3, 1])],
    });
}
