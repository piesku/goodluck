import {instantiate} from "../../lib/game.js";
import {mat4_compose} from "../../lib/mat4.js";
import {quat_from_euler} from "../../lib/quat.js";
import {float} from "../../lib/random.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {render_instanced_colored_unlit} from "../components/com_render_instanced.js";
import {set_position, set_rotation, transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [
        ...blueprint_camera(game),
        set_position(0, 40, 90),
        set_rotation(30, 180, 0),
    ]);

    let edge_length = 100;
    let instance_count = 10_000;

    let transforms = new Float32Array(instance_count * 16);
    let colors = new Float32Array(instance_count * 3);

    for (let i = 0; i < instance_count; i++) {
        let view = new Float32Array(transforms.buffer, i * 4 * 16, 16);
        mat4_compose(
            view,
            quat_from_euler([0, 0, 0, 1], float(-90, 90), float(-90, 90), float(-90, 90)),
            [float(-edge_length / 2, edge_length / 2), 0, float(-edge_length / 2, edge_length / 2)],
            [float(0.1, 0.5), float(0.5, 5), float(0.1, 0.5)],
        );

        let color = new Float32Array(colors.buffer, i * 4 * 3, 3);
        color[0] = float(0, 1);
        color[1] = float(0, 1);
        color[2] = float(0, 1);
    }

    instantiate(game, [
        transform(),
        render_instanced_colored_unlit(game.MeshCube, transforms, colors),
    ]);
}
