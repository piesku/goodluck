import {instantiate} from "../../common/game.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional, light_point} from "../components/com_light.js";
import {render_instanced} from "../components/com_render.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [...blueprint_camera(game), transform([2, 0, 5], [0, 1, 0, 0])]);

    // Directional light.
    instantiate(game, [transform([-2, 5, 5]), light_directional([1, 1, 1], 0.6)]);

    // Point light.
    instantiate(game, [transform([1, 4, 5]), light_point([1, 1, 1], 4)]);

    // A voxel model.
    instantiate(game, [
        transform(),
        render_instanced(
            game.MeshCube,
            Float32Array.from([0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1]),
            [1, 1, 0.3, 0.3, 1, 0.3]
        ),
    ]);
}
