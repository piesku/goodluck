/**
 * # Toggle
 *
 * The `Toggle` component allows to periodically enable and disable other
 * components on the entity.
 */

import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Toggle {
    Mask: number;
    Frequency: number;
    SinceLast: number;
}

/**
 * Add `Toggle` to an entity.
 *
 * @param mask The mask of the components to enable or disable.
 * @param frequency How often to toggle, in seconds.
 */
export function toggle(mask: number, frequency: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Toggle;
        game.World.Toggle[entity] = {
            Mask: mask,
            Frequency: frequency,
            SinceLast: 0,
        };
    };
}
