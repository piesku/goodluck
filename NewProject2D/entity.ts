import {Rad, Vec2} from "../common/math.js";
import {transform2d} from "./components/com_transform2d.js";
import {Entity, Game} from "./game.js";
import {Has, World} from "./world.js";

const MAX_ENTITIES = 10000;

export function create_entity(world: World) {
    for (let i = 0; i < MAX_ENTITIES; i++) {
        if (i === world.Signature.length || world.Signature[i] === 0) {
            world.Signature[i] = 0;
            return i;
        }
    }
    throw new Error("No more entities available.");
}

export function destroy_entity(world: World, entity: Entity) {
    if (world.Signature[entity] & Has.Transform2D) {
        for (let child of world.Transform2D[entity].Children) {
            destroy_entity(world, child);
        }
    }
    world.Signature[entity] = 0;
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
