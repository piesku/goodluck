/**
 * @module systems/sys_trigger
 */

import {Entity} from "../../common/world.js";
import {dispatch} from "../actions.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Collide | Has.Trigger;

export function sys_trigger(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let collide = game.World.Collide[entity];
    let trigger = game.World.Trigger[entity];

    for (let collision of collide.Collisions) {
        let other_collide = game.World.Collide[collision.Other];
        if (trigger.Mask & other_collide.Layers) {
            dispatch(game, trigger.Action, [entity, collision.Other]);
        }
    }
}
