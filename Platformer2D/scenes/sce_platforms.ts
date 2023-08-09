import {instantiate} from "../../lib/game.js";
import {local_transform2d, set_position} from "../components/com_local_transform2d.js";
import {render2d} from "../components/com_render2d.js";
import {Game, WORLD_CAPACITY} from "../game.js";
import {map_platforms} from "../maps/map_platforms.js";
import {World} from "../world.js";
import {blueprint_camera} from "./blu_camera.js";

// Raw flags defined by Tiled.
const TILE_FLIP_HORIZONTAL = 1 << 31;
const TILE_FLIP_VERTICAL = 1 << 30;
const TILE_FLIP_DIAGONAL = 1 << 29;
const TILE_FLIP_IGNORED = 1 << 28;

// Useful combinations of flags.
const TILE_ROTATE_LEFT = TILE_FLIP_VERTICAL | TILE_FLIP_DIAGONAL;
const TILE_ROTATE_RIGHT = TILE_FLIP_HORIZONTAL | TILE_FLIP_DIAGONAL;
const TILE_ROTATE_180 = TILE_FLIP_HORIZONTAL | TILE_FLIP_VERTICAL;
const TILE_ALL_FLAGS =
    TILE_FLIP_HORIZONTAL | TILE_FLIP_VERTICAL | TILE_FLIP_DIAGONAL | TILE_FLIP_IGNORED;

export function scene_platforms(game: Game) {
    game.World = new World(WORLD_CAPACITY);
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [
        ...blueprint_camera(game),
        set_position(map_platforms.width / 2, map_platforms.height / 2),
    ]);

    // Layer 0: Dungeon.
    let layer = map_platforms.layers[0];
    for (let i = 0; i < layer.data.length; i++) {
        let global_id = layer.data[i]; // Global ID with flip flags.
        let tile_id = global_id & ~TILE_ALL_FLAGS; // Remove flip flags.
        if (tile_id == 0) {
            continue;
        }

        let x = (i % layer.width) + 0.5;
        let y = layer.height - Math.floor(i / layer.width) - 0.5;
        let local: ReturnType<typeof local_transform2d>;

        // Rotate and flip flags are stored in the global ID.
        if ((global_id & TILE_ROTATE_LEFT) == TILE_ROTATE_LEFT) {
            local = local_transform2d([x, y], 90);
        } else if ((global_id & TILE_ROTATE_RIGHT) == TILE_ROTATE_RIGHT) {
            local = local_transform2d([x, y], -90);
        } else if ((global_id & TILE_ROTATE_180) == TILE_ROTATE_180) {
            local = local_transform2d([x, y], 180);
        } else if (global_id & TILE_FLIP_HORIZONTAL) {
            local = local_transform2d([x, y], 0, [-1, 1]);
        } else if (global_id & TILE_FLIP_VERTICAL) {
            local = local_transform2d([x, y], 0, [1, -1]);
        } else {
            local = local_transform2d([x, y]);
        }

        let tile_name = `${tile_id - 1}`;
        instantiate(game, [local, render2d(tile_name)]);
    }
}
