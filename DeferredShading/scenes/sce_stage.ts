import {from_euler} from "../../common/quat.js";
import {blueprint_camera_main} from "../blueprints/blu_camera_main.js";
import {blueprint_sun} from "../blueprints/blu_sun.js";
import {light_point} from "../components/com_light.js";
import {render_colored_deferred} from "../components/com_render.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {instantiate} from "../impl.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [...blueprint_camera_main(game), transform([1, 2, 5], [0, 1, 0, 0])]);

    // Sun.
    instantiate(game, [
        transform(undefined, from_euler([0, 0, 0, 0], -45, 45, 0)),
        ...blueprint_sun(game),
    ]);

    // Point light 1.
    instantiate(game, [transform([-3, 0, 4]), light_point([1, 0, 0], 3)]);

    // Point light 2.
    instantiate(game, [transform([3, 0, 4]), light_point([0, 0, 1], 3)]);

    // Ground.
    instantiate(game, [
        transform(undefined, undefined, [10, 1, 10]),
        render_colored_deferred(game.MaterialColored, game.MeshCube, [1, 1, 0, 1]),
    ]);

    instantiate(game, [
        transform([-1, 1, 0], undefined, [1, 1, 1]),
        render_colored_deferred(game.MaterialColored, game.MeshSphereSmooth, [1, 1, 1, 1], 64),
    ]);

    instantiate(game, [
        transform([1, 1, 0], undefined, [1, 1, 1]),
        render_colored_deferred(game.MaterialColored, game.MeshSphereSmooth, [1, 1, 1, 1], 512),
    ]);
}
