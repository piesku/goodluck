import {Quat, Vec3} from "../common/math.js";
import {children} from "./components/com_children.js";
import {transform} from "./components/com_transform.js";
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
export interface Blueprint {
    Translation?: Vec3;
    Rotation?: Quat;
    Scale?: Vec3;
    Using?: Array<Mixin>;
    Disable?: number;
    Children?: Array<Blueprint>;
}

export function instantiate(
    game: Game,
    {Translation, Rotation, Scale, Using = [], Disable, Children = []}: Blueprint
) {
    let entity = create_entity(game.World);
    transform(Translation, Rotation, Scale)(game, entity);
    for (let mixin of Using) {
        mixin(game, entity);
    }
    if (Disable) {
        game.World.Signature[entity] &= ~Disable;
    }
    if (Children.length > 0) {
        children(...Children)(game, entity);
    }
    return entity;
}
