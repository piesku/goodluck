import {Rad, Vec2} from "../common/math.js";
import {transform2d} from "./components/com_transform2d.js";
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
    if (world.Signature[entity] & Has.Transform2D) {
        for (let child of world.Transform2D[entity].Children) {
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
export interface Blueprint2D {
    Translation?: Vec2;
    Rotation?: Rad;
    Scale?: Vec2;
    Using?: Array<Mixin>;
    Children?: Array<Blueprint2D>;
}

export function instantiate(
    game: Game,
    {Translation, Rotation, Scale, Using = [], Children = []}: Blueprint2D
) {
    let entity = create_entity(game.World);
    transform2d(Translation, Rotation, Scale)(game, entity);
    for (let mixin of Using) {
        mixin(game, entity);
    }
    let entity_transform = game.World.Transform2D[entity];
    for (let subtree of Children) {
        let child = instantiate(game, subtree);
        let child_transform = game.World.Transform2D[child];
        child_transform.Parent = entity;
        entity_transform.Children.push(child);
    }
    return entity;
}
