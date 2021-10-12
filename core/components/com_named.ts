/**
 * @module components/com_named
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

export interface Named {
    Name: string;
}

export function named(Name: string) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Named;
        game.World.Named[entity] = {Name};
    };
}

export function first_named(world: World, name: string, start_at: Entity = 0) {
    for (let i = start_at; i < world.Signature.length; i++) {
        if (world.Signature[i] & Has.Named && world.Named[i].Name === name) {
            return i;
        }
    }
    throw `No entity named ${name}.`;
}
