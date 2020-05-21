import {blueprint_camera_fly} from "../blueprints/blu_camera_fly.js";
import {draw_marker} from "../components/com_draw.js";
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
        ...blueprint_camera_fly(game),
    });

    // Light.
    instantiate(game, {
        Translation: [2, 3, 5],
        Using: [light_directional([1, 1, 1], 1)],
    });

    // Ground.
    instantiate(game, {
        Translation: [0, 0, 0],
        Scale: [10, 1, 10],
        Using: [render_diffuse(game.MaterialDiffuseGouraud, game.MeshCube, [1, 1, 0.3, 1])],
    });

    // Box.
    instantiate(game, {
        Translation: [0, 1, 0],
        Using: [render_diffuse(game.MaterialDiffuseGouraud, game.MeshCube, [1, 1, 0.3, 1])],
        Children: [
            {
                Translation: [0, 1, 0],
                Using: [draw_marker("Hello!")],
            },
        ],
    });
}
