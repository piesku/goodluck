/**
 * # Named
 *
 * The `Name` component stores a name for the entity.
 */

import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

export interface Named {
    Name: string;
}

/**
 * Add `Named` to an entity.
 *
 * @param name The name of the entity.
 */
export function named(name: string) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Named;
        game.World.Named[entity] = {Name: name};
    };
}

/**
 * Find first entity with the given name.
 *
 * @param world The world to search.
 * @param name The name of the entity to find.
 * @param start_at The entity to start searching at.
 */
export function first_named(world: World, name: string, start_at: Entity = 0) {
    for (let i = start_at; i < world.Signature.length; i++) {
        if (world.Signature[i] & Has.Named && world.Named[i].Name === name) {
            return i;
        }
    }
    throw `No entity named ${name}.`;
}
