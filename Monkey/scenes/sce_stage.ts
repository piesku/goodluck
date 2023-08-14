import {instantiate} from "../../lib/game.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional, light_point} from "../components/com_light.js";
import {render_colored_shaded} from "../components/com_render.js";
import {set_position, set_rotation, transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [...blueprint_camera(game), set_position(0, 0, 3), set_rotation(0, 180, 0)]);

    // Directional light.
    instantiate(game, [transform(), set_rotation(-30, 30, 0), light_directional([1, 1, 1], 0.3)]);

    // Point light.
    instantiate(game, [transform([1, 4, 5]), light_point([1, 1, 1], 4)]);

    // Flat.
    instantiate(game, [
        transform([-0.7, 0.5, 0]),
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshMonkeyFlat, [1, 1, 0.3, 1], 0),
    ]);

    // Phong.
    instantiate(game, [
        transform([0.7, -0.5, 0]),
        render_colored_shaded(
            game.MaterialColoredPhong,
            game.MeshMonkeySmooth,
            [1, 1, 0.3, 1],
            512,
        ),
    ]);
}
