/**
 * # sys_trigger2d
 *
 * Emit an `Action` when another entity collides with this entity.
 */

import {Entity} from "../../lib/world.js";
import {dispatch} from "../actions.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Collide2D | Has.Trigger;

export function sys_trigger2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let collide = game.World.Collide2D[entity];
    let trigger = game.World.Trigger[entity];

    for (let collision of collide.Collisions) {
        let other_collide = game.World.Collide2D[collision.Other];
        if (trigger.Mask & other_collide.Layers) {
            dispatch(game, trigger.Action, [entity, collision.Other]);
        }
    }
}
