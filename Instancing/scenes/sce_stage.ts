import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light} from "../components/com_light.js";
import {render_instanced} from "../components/com_render_instanced.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Cameras = [];
    game.LightPositions = [];
    game.LightDetails = [];
    game.ViewportResized = true;
    game.GL.clearColor(1, 0.3, 0.3, 1);

    // Camera.
    instantiate(game, {
        Translation: [2, 0, 5],
        ...blueprint_camera(game),
    });

    // Light 1.
    instantiate(game, {
        Translation: [-2, 5, 5],
        Using: [light([1, 1, 1], 3)],
    });

    // Light 2.
    instantiate(game, {
        Translation: [1, 3, 5],
        Using: [light([1, 1, 1], 5)],
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
