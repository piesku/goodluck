import {blueprint_camera_main} from "../blueprints/blu_camera_main.js";
import {control_move} from "../components/com_control_move.js";
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

    // Checker Box.
    instantiate(game, [
        transform([-0.5, 0, 0]),
        control_move(null, [0.1276794, 0.1448781, 0.2685358, 0.9437144]),
        move(0, 1),
        render_colored(game.MaterialColored, game.MeshCube, [1, 0, 0, 1]),
    ]);
}
