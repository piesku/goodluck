import {blueprint_camera_main} from "../blueprints/blu_camera_main.js";
import {control_move} from "../components/com_control_move.js";
import {light_directional, light_point} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {render_colored} from "../components/com_render_deferred.js";
import {transform} from "../components/com_transform.js";
import {instantiate} from "../entity.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Main Camera.
    instantiate(game, [...blueprint_camera_main(game), transform([0, 0, 3], [0, 1, 0, 0])]);

    // Directional light.
    instantiate(game, [transform([1, 1, 1]), light_directional([1, 1, 1], 0.5)]);

    // Point light 1.
    instantiate(game, [transform([-3, 0, 4]), light_point([1, 0, 0], 3)]);

    // Point light 2.
    instantiate(game, [transform([3, 0, 4]), light_point([0, 0, 1], 3)]);

    instantiate(game, [
        transform([-0.7, 0.7, 0], undefined, [1, 1, 1]),
        control_move(null, [0, 1, 0, 0]),
        move(0, 0.5),
        render_colored(game.MaterialColored, game.MeshSphereFlat, [1, 1, 1, 1], [1, 1, 1], 100),
    ]);

    instantiate(game, [
        transform([0.7, 0.7, 0], undefined, [1, 1, 1]),
        control_move(null, [0, 1, 0, 0]),
        move(0, 0.5),
        render_colored(game.MaterialColored, game.MeshSphereFlat, [1, 1, 1, 1], [1, 1, 1], 1000),
    ]);

    instantiate(game, [
        transform([-0.7, -0.7, 0], undefined, [1, 1, 1]),
        control_move(null, [0, 1, 0, 0]),
        move(0, 0.5),
        render_colored(game.MaterialColored, game.MeshSphereSmooth, [1, 1, 1, 1], [1, 1, 1], 100),
    ]);

    instantiate(game, [
        transform([0.7, -0.7, 0], undefined, [1, 1, 1]),
        control_move(null, [0, 1, 0, 0]),
        move(0, 0.5),
        render_colored(game.MaterialColored, game.MeshSphereSmooth, [1, 1, 1, 1], [1, 1, 1], 1000),
    ]);
}
