/**
 * # Children
 *
 * The `Children` component is used to group entities together under a common parent.
 *
 * The parent-child relationship can express a hierarchy of entities in the
 * scene graph (when used with [`transform`](com_transform.html) or
 * [`spatial_node2d`](com_spatial_node2d.html)), or it can be used to create
 * dependencies between [tasks](com_task.html).
 */

import {Blueprint, instantiate} from "../../lib/game.js";
import {Entity, destroy_entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

export interface Children {
    Children: Array<Entity>;
}

/**
 * Add `Children` to an entity.
 *
 * @param blueprints Blueprints to instantiate as children of the entity.
 */
export function children(...blueprints: Array<Blueprint<Game>>) {
    return (game: Game, entity: Entity) => {
        if (game.World.Signature[entity] & Has.Children) {
            // When called on an entity which already has children, this mixin
            // does not replace the children array. Thus, the mixin can be
            // safely called multiple times on the same entity.
        } else {
            game.World.Signature[entity] |= Has.Children;
            game.World.Children[entity] = {
                Children: [],
            };
        }

        let child_entities = game.World.Children[entity].Children;
        for (let blueprint of blueprints) {
            let child = instantiate(game, blueprint);
            child_entities.push(child);
        }
    };
}

/**
 * Yield descendants matching a component mask. Start at the current entity.
 *
 * @param world World object which stores the component data.
 * @param entity Parent entity to traverse.
 * @param mask Component mask to look for.
 */
export function* query_down(world: World, entity: Entity, mask: Has): IterableIterator<Entity> {
    if ((world.Signature[entity] & mask) === mask) {
        yield entity;
    }
    if (world.Signature[entity] & Has.Children) {
        for (let child of world.Children[entity].Children) {
            yield* query_down(world, child, mask);
        }
    }
}

/**
 * Delete the entity with all its descendants.
 *
 * @param world World object which stores the component data.
 * @param entity The root entity to start removing at.
 */
export function destroy_all(world: World, entity: Entity) {
    if (world.Signature[entity] & Has.Children) {
        for (let child of world.Children[entity].Children) {
            destroy_all(world, child);
        }
    }

    if (world.Signature[entity] === Has.None) {
        // This entity has already been deleted.
    } else {
        destroy_entity(world, entity);
    }
}
