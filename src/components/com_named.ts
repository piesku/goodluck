import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export interface Named {
    Name: string;
}

export function named(Name: string) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Named;
        game.World.Named[entity] = <Named>{Name};
    };
}

export function find_first(game: Game, name: string) {
    for (let i = 0; i < game.World.Named.length; i++) {
        let named = game.World.Named[i];
        if (named && named.Name === name) {
            return i;
        }
    }
    throw `No entity named ${name}.`;
}
