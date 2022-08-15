/**
 * # Disable
 *
 * A utility mixin which disables a component mask when an entity is created.
 *
 * This is useful for adding components to an entity during instantiation, and
 * immediately disabling them. The `disable()` mixin must be used **after** the
 * mixins of components that are to be disabled.
 *
 *     instantiate(game, [
 *         transform(),
 *         // Add and set up the `Lifespan` component.
 *         lifespan(5),
 *         // Disable it.
 *         disable(Has.Lifespan),
 *     ])
 */

import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";

/**
 * Disable a component mask when an entity is created.
 *
 * This is useful for adding components to an entity during instantiation, and
 * immediately disabling them.
 *
 * @param mask The component mask to disable.
 */
export function disable(mask: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] &= ~mask;
    };
}
