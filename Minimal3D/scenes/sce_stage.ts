import {instantiate} from "../../common/game.js";
import {from_euler} from "../../common/quat.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional} from "../components/com_light.js";
import {render_colored_shaded} from "../components/com_render.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [transform([1, 2, 5], [0, 1, 0, 0]), ...blueprint_camera(game)]);

    // Light.
    instantiate(game, [
        transform(undefined, from_euler([0, 0, 0, 1], -30, 30, 0)),
        light_directional([1, 1, 1], 1),
    ]);

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
