import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional, light_point} from "../components/com_light.js";
import {render_colored_diffuse, render_colored_specular} from "../components/com_render1.js";
import {transform} from "../components/com_transform.js";
import {instantiate} from "../entity.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [...blueprint_camera(game), transform([0, 0, 3], [0, 1, 0, 0])]);

    // Directional light.
    instantiate(game, [transform([-2, 5, 5]), light_directional([1, 1, 1], 0.6)]);

    // Point light.
    instantiate(game, [transform([1, 4, 5]), light_point([1, 1, 1], 4)]);

    // Flat.
    instantiate(game, [
        transform([-0.7, 0.5, 0]),
        render_colored_diffuse(game.MaterialColoredDiffuseGouraud, game.Meshes["monkey_flat"], [
            1,
            1,
            0.3,
            1,
        ]),
    ]);

    // Phong.
    instantiate(game, [
        transform([0.7, -0.5, 0]),
        render_colored_specular(
            game.MaterialColoredSpecularPhong,
            game.Meshes["monkey_smooth"],
            [1, 1, 0.3, 1],
            64
        ),
    ]);
}
