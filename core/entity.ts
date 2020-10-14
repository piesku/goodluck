import {Quat, Vec3} from "../common/math.js";
import {transform} from "./components/com_transform.js";
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
    if (world.Signature[entity] & Has.Transform) {
        for (let child of world.Transform[entity].Children) {
            destroy_entity(world, child);
        }
    }
    world.Signature[entity] = 0;
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
    let entity_transform = game.World.Transform[entity];
    for (let subtree of Children) {
        let child = instantiate(game, subtree);
        let child_transform = game.World.Transform[child];
        child_transform.Parent = entity;
        entity_transform.Children.push(child);
    }
    return entity;
}
