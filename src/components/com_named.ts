import {Entity, Game} from "../game.js";
import {World} from "../world.js";
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

export function find_first(world: World, name: string) {
    for (let i = 0; i < world.Mask.length; i++) {
        if (world.Mask[i] & Has.Named && world.Named[i].Name === name) {
            return i;
        }
    }
    throw `No entity named ${name}.`;
}
