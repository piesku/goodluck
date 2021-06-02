import {from_euler} from "../../common/quat.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {camera_depth_ortho} from "../components/com_camera.js";
import {children} from "../components/com_children.js";
import {control_always} from "../components/com_control_always.js";
import {light_directional} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {render_colored_shaded} from "../components/com_render1.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {instantiate} from "../impl.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [...blueprint_camera(game), transform([1, 2, 5], [0, 1, 0, 0])]);

    // Sun.
    instantiate(game, [
        transform(undefined, from_euler([0, 0, 0, 0], -45, 45, 0)),
        control_always(null, [0, 1, 0, 0]),
        move(0, 0.5),
        children([
            transform([0, 0, 10]),
            light_directional([1, 1, 1], 0.9),
            camera_depth_ortho(game.Targets.Sun, 100, 1, 100),
        ]),
    ]);

    // Ground.
    instantiate(game, [
        transform(undefined, undefined, [10, 1, 10]),
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 1, 0, 1]),
    ]);

    // Cube.
    instantiate(game, [
        transform([0, 1, 0]),
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 1, 0, 1]),
    ]);
}
