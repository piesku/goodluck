import {instantiate} from "../../common/game.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_viewer} from "../blueprints/blu_viewer.js";
import {light_directional} from "../components/com_light.js";
import {render_colored_shaded} from "../components/com_render.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.Gl.clearColor(0.9, 0.9, 0.9, 1);

    // Camera.
    instantiate(game, [...blueprint_camera(game), transform([1, 2, 5], [0, 1, 0, 0])]);

    // VR Camera.
    instantiate(game, [...blueprint_viewer(game), transform([1, 2, 5])]);

    // Light.
    instantiate(game, [transform([2, 4, 3]), light_directional([1, 1, 1], 1)]);

    // Ground.
    instantiate(game, [
        transform(undefined, undefined, [7, 1, 7]),
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 1, 0.3, 1]),
    ]);

    // Box.
    instantiate(game, [
        transform([0, 1, 0]),
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 1, 0.3, 1]),
    ]);
}
