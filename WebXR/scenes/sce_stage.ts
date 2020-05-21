import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_viewer} from "../blueprints/blu_viewer.js";
import {light_directional} from "../components/com_light.js";
import {render_diffuse} from "../components/com_render_diffuse.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.Gl.clearColor(0.9, 0.9, 0.9, 1);

    // Camera.
    instantiate(game, {
        Translation: [1, 2, 5],
        ...blueprint_camera(game),
    });

    // VR Camera.
    instantiate(game, {
        Translation: [1, 2, 5],
        ...blueprint_viewer(game),
    });

    // Light.
    instantiate(game, {
        Translation: [2, 4, 3],
        Using: [light_directional([1, 1, 1], 1)],
    });

    // Ground.
    instantiate(game, {
        Translation: [0, 0, 0],
        Scale: [7, 1, 7],
        Using: [render_diffuse(game.MaterialDiffuseGouraud, game.MeshCube, [1, 1, 0.3, 1])],
    });

    // Box.
    instantiate(game, {
        Translation: [0, 1, 0],
        Using: [render_diffuse(game.MaterialDiffuseGouraud, game.MeshCube, [1, 1, 0.3, 1])],
    });
}
