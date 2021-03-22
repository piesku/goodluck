import {blueprint_camera_follow} from "../blueprints/blu_camera_follow.js";
import {blueprint_ground} from "../blueprints/blu_ground.js";
import {blueprint_player} from "../blueprints/blu_player.js";
import {light_directional} from "../components/com_light.js";
import {transform} from "../components/com_transform.js";
import {instantiate} from "../entity.js";
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
    instantiate(game, [transform([1, 1, 1]), light_directional([1, 1, 1], 0.2)]);

    // Player.
    instantiate(game, [...blueprint_player(game), transform([0, 1, 0], [0, 1, 0, 0])]);

    // Camera.
    instantiate(game, [...blueprint_camera_follow(game), transform([0, 1000, 1000], [0, 1, 0, 0])]);
}
