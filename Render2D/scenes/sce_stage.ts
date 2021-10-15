import {instantiate} from "../../common/game.js";
import {from_euler} from "../../common/quat.js";
import {float} from "../../common/random.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {render2d} from "../components/com_render2d.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [...blueprint_camera(game), transform([0, 0, 3], [0, 1, 0, 0])]);

    for (let i = 0; i < game.InstanceCount; i++) {
        instantiate(game, [
            transform(
                [float() * 2 - 1, float() * 2 - 1, float() * 2 - 1],
                from_euler([0, 0, 0, 1], 0, 0, float() * Math.PI),
                [0.05, 0.05, 0.05]
            ),
            render2d([float(), float(), float(), 1]),
        ]);
    }
}
