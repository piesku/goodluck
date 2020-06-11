import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface Lifespan {
    Max: number;
    Age: number;
}

export function lifespan(Max = Infinity) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Lifespan;
        game.World.Lifespan[entity] = {
            Max,
            Age: 0,
        };
    };
}
