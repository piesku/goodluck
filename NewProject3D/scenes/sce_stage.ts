import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional} from "../components/com_light.js";
import {render_colored_shaded} from "../components/com_render1.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {instantiate} from "../impl.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [transform([1, 2, 5], [0, 1, 0, 0]), ...blueprint_camera(game)]);

    // Light.
    instantiate(game, [transform([2, 3, 5]), light_directional([1, 1, 1], 1)]);

    // Ground.
    instantiate(game, [
        transform(undefined, undefined, [10, 1, 10]),
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 1, 0.3, 1]),
    ]);

    // Box.
    instantiate(game, [
        transform([0, 1, 0]),
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 1, 0.3, 1]),
    ]);
}
