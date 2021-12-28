import {instantiate} from "../../common/game.js";
import {from_euler} from "../../common/quat.js";
import {element, float} from "../../common/random.js";
import {blueprint_bulb} from "../blueprints/blu_bulb.js";
import {blueprint_camera_main} from "../blueprints/blu_camera_main.js";
import {blueprint_sun} from "../blueprints/blu_sun.js";
import {children} from "../components/com_children.js";
import {render_colored_deferred} from "../components/com_render.js";
import {shake} from "../components/com_shake.js";
import {spawn} from "../components/com_spawn.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [
        ...blueprint_camera_main(game),
        transform([0, 10, 25], from_euler([0, 0, 0, 1], 15, 180, 0)),
    ]);

    // Sun.
    instantiate(game, [
        transform(undefined, from_euler([0, 0, 0, 0], -45, 45, 0)),
        ...blueprint_sun(game),
    ]);

    // Ground.
    instantiate(game, [
        transform(undefined, undefined, [20, 1, 20]),
        render_colored_deferred(game.MaterialColored, game.MeshCube, [1, 1, 1]),
    ]);

    // Tower.
    instantiate(game, [
        transform([-5, 4, 0], undefined, [2, 8, 2]),
        render_colored_deferred(game.MaterialColored, game.MeshCube, [1, 1, 1]),
    ]);

    // Bulb spawner.
    instantiate(game, [
        transform([0, 3, 0], undefined, [20, 1, 20]),
        children([
            transform(),
            shake(0.5),
            spawn((game) => {
                game.BulbCount++;
                return blueprint_bulb(game);
            }, 0.1),
        ]),
    ]);

    for (let i = 0; i < 100; i++) {
        instantiate(game, [
            transform([float(-10, 10), 1, float(-10, 10)], undefined, [1, 1, 1]),
            render_colored_deferred(
                game.MaterialColored,
                game.MeshSphereSmooth,
                [1, 1, 1],
                0,
                element([64, 128, 256, 512])
            ),
        ]);
    }
}
