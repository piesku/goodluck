import {instantiate} from "../../common/game.js";
import {from_euler} from "../../common/quat.js";
import {float} from "../../common/random.js";
import {blueprint_camera_follow} from "../blueprints/blu_camera_follow.js";
import {blueprint_ground} from "../blueprints/blu_ground.js";
import {blueprint_item} from "../blueprints/blu_item.js";
import {blueprint_obstacle} from "../blueprints/blu_obstacle.js";
import {blueprint_player} from "../blueprints/blu_player.js";
import {children} from "../components/com_children.js";
import {control_always} from "../components/com_control_always.js";
import {light_directional} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {shake} from "../components/com_shake.js";
import {spawn} from "../components/com_spawn.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    let map_size = 10;
    let tile_size = 5;
    for (let z = 0; z < map_size; z++) {
        for (let x = 0; x < map_size; x++) {
            // Ground.
            instantiate(game, [
                ...blueprint_ground(game),
                transform(
                    [tile_size * (x - map_size / 2), 0, tile_size * (z - map_size / 2)],
                    undefined,
                    [tile_size, 1, tile_size]
                ),
            ]);
        }
    }

    // Directional light.
    instantiate(game, [
        transform(undefined, from_euler([0, 0, 0, 1], -30, 30, 0)),
        light_directional([1, 1, 1], 0.1),
    ]);

    // Player.
    instantiate(game, [...blueprint_player(game), transform([0, 1, 0], [0, 1, 0, 0])]);

    // Camera.
    instantiate(game, [...blueprint_camera_follow(game), transform([0, 1000, 1000], [0, 1, 0, 0])]);

    // Item spawner.
    instantiate(game, [
        transform([0, 15, 0]),
        control_always(null, [0, 1, 0, 0]),
        move(0, 1),
        children([
            transform([0, 0, 10]),
            children([transform(), shake(10), spawn(blueprint_item, 3)]),
        ]),
    ]);

    for (let i = 0; i < 100; i++) {
        instantiate(game, [
            transform([float(-10, 10), 1, float(-10, 10)], undefined, [
                float(0.5, 1.5),
                float(0.5, 1.5),
                float(0.5, 1.5),
            ]),
            ...blueprint_obstacle(game),
        ]);
    }
}
