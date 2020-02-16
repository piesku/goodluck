import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_ground} from "../blueprints/blu_ground.js";
import {blueprint_player} from "../blueprints/blu_player.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Cameras = [];
    game.Lights = [];
    game.GL.clearColor(1, 0.3, 0.3, 1);

    let map_size = 10;
    let tile_size = 5;
    for (let z = 0; z < map_size; z++) {
        for (let x = 0; x < map_size; x++) {
            // Ground.
            instantiate(game, {
                Translation: [tile_size * (x - map_size / 2), 0, tile_size * (z - map_size / 2)],
                ...blueprint_ground(game, tile_size),
            });
        }
    }

    // Player.
    instantiate(game, {
        ...blueprint_player(game),
        Translation: [0, 1, 0],
    });

    // Camera.
    instantiate(game, blueprint_camera(game));
}
