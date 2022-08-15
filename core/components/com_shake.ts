/**
 * # Shake
 *
 * The `Shake` component allows the entity to change its position randomly every
 * frame.
 *
 * It should only be used on child entities whose position relative to the
 * parent is [0, 0, 0].
 */

import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Shake {
    Radius: number;
}

/**
 * Add `Shake` to an entity.
 *
 * @param radius The radius of the shake, in local units.
 */
export function shake(radius: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Shake;
        game.World.Shake[entity] = {
            Radius: radius,
        };
    };
}
