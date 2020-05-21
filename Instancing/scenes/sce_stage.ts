import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional, light_point} from "../components/com_light.js";
import {render_instanced} from "../components/com_render_instanced.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.Gl.clearColor(0.9, 0.9, 0.9, 1);

    // Camera.
    instantiate(game, {
        Translation: [2, 0, 5],
        ...blueprint_camera(game),
    });

    // Directional light.
    instantiate(game, {
        Translation: [-2, 5, 5],
        Using: [light_directional([1, 1, 1], 0.6)],
    });

    // Point light.
    instantiate(game, {
        Translation: [1, 4, 5],
        Using: [light_point([1, 1, 1], 4)],
    });

    // A voxel model.
    instantiate(game, {
        Translation: [0, 0, 0],
        Using: [
            render_instanced(
                game.MeshCube,
                Float32Array.from([0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1]),
                [1, 1, 0.3, 0.3, 1, 0.3]
            ),
        ],
    });
}
