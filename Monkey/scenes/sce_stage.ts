import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional, light_point} from "../components/com_light.js";
import {render_diffuse} from "../components/com_render_diffuse.js";
import {render_specular} from "../components/com_render_specular.js";
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
        Translation: [0, 0, 3],
        ...blueprint_camera(game),
    });

    // Directional light.
    instantiate(game, {
        Translation: [-2, 5, 5],
        Using: [light_directional([1, 1, 1], 0.6)],
    });

    // Point light.
    instantiate(game, {
        Translation: [1, 4, 5],
        Using: [light_point([1, 1, 1], 4)],
    });

    // Flat.
    instantiate(game, {
        Translation: [-0.7, 0.5, 0],
        Using: [
            render_diffuse(game.MaterialDiffuseGouraud, game.Meshes["monkey_flat"], [1, 1, 0.3, 1]),
        ],
    });

    // Phong.
    instantiate(game, {
        Translation: [0.7, -0.5, 0],
        Using: [
            render_specular(
                game.MaterialSpecularPhong,
                game.Meshes["monkey_smooth"],
                [1, 1, 0.3, 1],
                64
            ),
        ],
    });
}
