/**
 * @module systems/sys_lifespan
 */

import {Entity} from "../../common/world.js";
import {dispatch} from "../actions.js";
import {destroy_all} from "../components/com_children.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Lifespan;

export function sys_lifespan(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let lifespan = game.World.Lifespan[entity];
    lifespan.Remaining -= delta;
    if (lifespan.Remaining < 0) {
        if (lifespan.Action) {
            dispatch(game, lifespan.Action, entity);
        }
        destroy_all(game.World, entity);
    }
}
