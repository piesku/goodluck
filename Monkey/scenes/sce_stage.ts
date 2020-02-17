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
    game.GL.clearColor(1, 0.3, 0.3, 1);

    // Camera.
    instantiate(game, {
        Translation: [0, 0, 3],
        ...blueprint_camera(game),
    });

    // Light 1.
    instantiate(game, {
        Translation: [-2, 5, 5],
        Using: [light([1, 1, 1], 3)],
    });

    // Light 2.
    instantiate(game, {
        Translation: [1, 4, 5],
        Using: [light([1, 1, 1], 5)],
    });

    // Flat.
    instantiate(game, {
        Translation: [-0.7, 0.5, 0],
        Using: [render_shaded(game.MaterialFlat, game.MeshMonkeyFlat, [1, 1, 0.3, 1])],
    });

    // Phong.
    instantiate(game, {
        Translation: [0.7, -0.5, 0],
        Using: [render_shaded(game.MaterialPhong, game.MeshMonkeySmooth, [1, 1, 0.3, 1])],
    });
}
