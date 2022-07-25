/**
 * @module systems/sys_spawn2d
 */

import {instantiate} from "../../common/game.js";
import {get_translation} from "../../common/mat2d.js";
import {Vec2} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {transform2d} from "../components/com_transform2d.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform2D | Has.Spawn;

export function sys_spawn2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let spawn = game.World.Spawn[entity];

    spawn.SinceLast += delta;
    if (spawn.SinceLast > spawn.Interval) {
        spawn.SinceLast = 0;

        let entity_transform = game.World.Transform2D[entity];
        let world_position: Vec2 = [0, 0];
        get_translation(world_position, entity_transform.World);

        if (game.World.Signature.length - game.World.Graveyard.length < game.World.Capacity) {
            instantiate(game, [...spawn.Creator(game), transform2d(world_position, 0)]);
        } else if (DEBUG) {
            throw new Error("No more entities can be created; the world at maximum capacity.");
        }
    }
}
