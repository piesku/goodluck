/**
 * # Trigger
 *
 * The `Trigger` component allows the entity's collider to trigger `Actions`.
 */

import {Entity} from "../../lib/world.js";
import {Action} from "../actions.js";
import {Game, Layer} from "../game.js";
import {Has} from "../world.js";

export interface Trigger {
    Mask: Layer;
    Action: Action;
}

/**
 * Add `Trigger` to an entity.
 *
 * @param mask The mask of the collision layers to trigger on.
 * @param action The action to trigger.
 */
export function trigger(mask: Layer, action: Action) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Trigger;
        game.World.Trigger[entity] = {
            Mask: mask,
            Action: action,
        };
    };
}
