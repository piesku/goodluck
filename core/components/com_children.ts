/**
 * @module components/com_children
 */

import {Blueprint, instantiate} from "../../common/game.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

export interface Children {
    Children: Array<Entity>;
}

export function children(...blueprints: Array<Blueprint<Game>>) {
    return (game: Game, entity: Entity) => {
        let child_entities = [];
        for (let blueprint of blueprints) {
            let child = instantiate(game, blueprint);
            child_entities.push(child);
        }
        game.World.Signature[entity] |= Has.Children;
        game.World.Children[entity] = {
            Children: child_entities,
        };
    };
}

/**
 * Add one more child blueprint to the entity. Must be used after children().
 */
export function child(blueprint: Blueprint<Game>) {
    return (game: Game, entity: Entity) => {
        let children = game.World.Children[entity];
        let child = instantiate(game, blueprint);
        children.Children.push(child);
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
 * @param world World object which stores the component data.
 * @param entity The root entity to start removing at.
 */
export function destroy_all(world: World, entity: Entity) {
    if (world.Signature[entity] & Has.Children) {
        for (let child of world.Children[entity].Children) {
            destroy_all(world, child);
        }
    }

    world.DestroyEntity(entity);
}
