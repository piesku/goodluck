import {Entity, Game} from "./game.js";

type Mixin = (game: Game, entity: Entity) => void;
export type Blueprint = Array<Mixin>;

export function instantiate(game: Game, blueprint: Blueprint) {
    let entity = game.World.CreateEntity();
    for (let mixin of blueprint) {
        mixin(game, entity);
    }
    return entity;
}
