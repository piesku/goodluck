import {Entity, Game} from "./game.js";
import {Has} from "./world.js";

type Mixin = (game: Game, entity: Entity) => void;
export type Blueprint = Array<Mixin>;

export function instantiate(game: Game, blueprint: Blueprint) {
    let entity = game.World.CreateEntity();
    for (let mixin of blueprint) {
        mixin(game, entity);
    }
    return entity;
}

export function destroy(game: Game, entity: Entity) {
    if (game.World.Signature[entity] & Has.Children) {
        for (let child of game.World.Children[entity].Children) {
            destroy(game, child);
        }
    }

    game.World.DestroyEntity(entity);
}
