import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface Lifespan {
    Remaining: number;
}

export function lifespan(remaining: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Lifespan;
        game.World.Lifespan[entity] = {
            Remaining: remaining,
        };
    };
}
