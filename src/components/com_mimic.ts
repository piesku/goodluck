import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface Mimic {
    /** Entity whose transform to mimic. */
    target: Entity;
    /** How laggy vs. precise is the mimicking [0-1]. */
    stiffness: number;
}

export function mimic(target: Entity, stiffness: number = 0.1) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.Mimic;
        game[Get.Mimic][entity] = <Mimic>{
            target,
            stiffness,
        };
    };
}
