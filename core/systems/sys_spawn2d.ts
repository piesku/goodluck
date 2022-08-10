/**
 * # sys_spawn2d
 *
 * Instantiate blueprints into the world periodically. Spawned entities inherit
 * the spawner's position and rotation.
 */

import {instantiate} from "../../common/game.js";
import {get_translation} from "../../common/mat2d.js";
import {Vec2} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {copy_position} from "../components/com_transform2d.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.SpatialNode2D | Has.Spawn;

export function sys_spawn2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

const world_position: Vec2 = [0, 0];

function update(game: Game, entity: Entity, delta: number) {
    let spawn = game.World.Spawn[entity];

    spawn.SinceLast += delta;
    if (spawn.SinceLast > spawn.Interval) {
        spawn.SinceLast = 0;

        let spatial_node = game.World.SpatialNode2D[entity];
        get_translation(world_position, spatial_node.World);

        if (game.World.Signature.length - game.World.Graveyard.length < game.World.Capacity) {
            instantiate(game, [...spawn.Creator(game), copy_position(world_position)]);
        } else if (DEBUG) {
            throw new Error("No more entities can be created; the world at maximum capacity.");
        }
    }
}
