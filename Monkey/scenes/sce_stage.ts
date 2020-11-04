import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional, light_point} from "../components/com_light.js";
import {render_colored_diffuse, render_colored_specular} from "../components/com_render1.js";
import {instantiate} from "../entity.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

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
            render_colored_diffuse(game.MaterialColoredDiffuseGouraud, game.Meshes["monkey_flat"], [
                1,
                1,
                0.3,
                1,
            ]),
        ],
    });

    // Phong.
    instantiate(game, {
        Translation: [0.7, -0.5, 0],
        Using: [
            render_colored_specular(
                game.MaterialColoredSpecularPhong,
                game.Meshes["monkey_smooth"],
                [1, 1, 0.3, 1],
                64
            ),
        ],
    });
}
