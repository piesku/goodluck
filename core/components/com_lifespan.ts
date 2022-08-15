/**
 * # Lifespan
 *
 * The `Lifespan` component allows the entity to autodestruct after a certain
 * time. Upon destruction, the entity can emit an `Action`.
 */

import {Entity} from "../../lib/world.js";
import {Action} from "../actions.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Lifespan {
    Remaining: number;
    Action?: Action;
}

/**
 * Add `Lifespan` to an entity.
 *
 * @param remaining How long until the entity is destroyed (in seconds).
 * @param action Optional action to dispatch when the entity is destroyed.
 */
export function lifespan(remaining: number, action?: Action) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Lifespan;
        game.World.Lifespan[entity] = {
            Remaining: remaining,
            Action: action,
        };
    };
}
