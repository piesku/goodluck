import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional} from "../components/com_light.js";
import {render_colored_diffuse} from "../components/com_render1.js";
import {instantiate} from "../entity.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, {
        Translation: [1, 2, 5],
        ...blueprint_camera(game),
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
        Using: [
            render_colored_diffuse(game.MaterialColoredDiffuseGouraud, game.MeshCube, [
                1,
                1,
                0.3,
                1,
            ]),
        ],
    });

    // Box.
    instantiate(game, {
        Translation: [0, 1, 0],
        Using: [
            render_colored_diffuse(game.MaterialColoredDiffuseGouraud, game.MeshCube, [
                1,
                1,
                0.3,
                1,
            ]),
        ],
    });
}
