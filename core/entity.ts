import {Entity, Game} from "./game.js";
import {Has, World} from "./world.js";

export function create_entity(world: World) {
    if (world.Graveyard.length > 0) {
        return world.Graveyard.pop()!;
    }

    if (DEBUG && world.Signature.length > 10000) {
        throw new Error("No more entities available.");
    }

    // Push a new signature and return its index.
    return world.Signature.push(0) - 1;
}

export function destroy_entity(world: World, entity: Entity) {
    if (world.Signature[entity] & Has.Children) {
        for (let child of world.Children[entity].Children) {
            destroy_entity(world, child);
        }
    }

    world.Signature[entity] = 0;

    if (DEBUG && world.Graveyard.includes(entity)) {
        throw new Error("Entity already in graveyard.");
    }

    world.Graveyard.push(entity);
}

type Mixin = (game: Game, entity: Entity) => void;
export type Blueprint = Array<Mixin>;

export function instantiate(game: Game, blueprint: Blueprint) {
    let entity = create_entity(game.World);
    for (let mixin of blueprint) {
        mixin(game, entity);
    }
    return entity;
}
