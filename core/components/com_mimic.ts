/**
 * # Mimic
 *
 * The `Mimic` component allows an entity to mimic another entity, i.e. match
 * the target entity's position and rotation with a small lag.
 *
 * `Mimic` is different from `Follow` in that `Follow` only follows the
 * position, but not the rotation of the target entity.
 */

import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Mimic {
    /** Entity whose transform to mimic. */
    Target: Entity;
    /** How laggy vs. precise is the mimicking [0-1]. */
    Stiffness: number;
}

/**
 * Add `Mimic` to an entity.
 *
 * @param target Entity whose transform to mimic.
 * @param stiffness How laggy vs. precise is the mimicking [0-1].
 */
export function mimic(target: Entity, stiffness: number = 0.1) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Mimic;
        game.World.Mimic[entity] = {
            Target: target,
            Stiffness: stiffness,
        };
    };
}
