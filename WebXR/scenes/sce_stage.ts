import {instantiate} from "../../lib/game.js";
import {quat_from_euler} from "../../lib/quat.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_viewer} from "../blueprints/blu_viewer.js";
import {light_directional} from "../components/com_light.js";
import {render_colored_shaded} from "../components/com_render.js";
import {set_position, set_rotation, transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Cameras = [];
    game.ViewportResized = true;
    game.Gl.clearColor(0.9, 0.9, 0.9, 1);

    // Camera.
    instantiate(game, [...blueprint_camera(game), set_position(1, 2, 5), set_rotation(0, 180, 0)]);

    // VR Camera.
    instantiate(game, [...blueprint_viewer(game), set_position(1, 2, 5)]);

    // Light.
    instantiate(game, [
        transform(undefined, quat_from_euler([0, 0, 0, 1], -30, 30, 0)),
        light_directional([1, 1, 1], 0.5),
    ]);

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
