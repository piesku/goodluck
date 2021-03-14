import {Blueprint, instantiate} from "../entity.js";
import {Entity, Game} from "../game.js";
import {Has, World} from "../world.js";

export interface Children {
    Children: Array<Entity>;
}

export function children(...blueprints: Array<Blueprint>) {
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
 * Yield entities matching a component mask. The query is tested against the
 * parent and all its descendants.
 *
 * @param world World object which stores the component data.
 * @param parent Parent entity to traverse.
 * @param mask Component mask to look for.
 */
export function* query_all(world: World, parent: Entity, mask: Has): IterableIterator<Entity> {
    if (world.Signature[parent] & mask) {
        yield parent;
    }
    if (world.Signature[parent] & Has.Children) {
        for (let child of world.Children[parent].Children) {
            yield* query_all(world, child, mask);
        }
    }
}
