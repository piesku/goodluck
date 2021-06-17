/**
 * @module components/com_mimic
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Mimic {
    /** Entity whose transform to mimic. */
    Target: Entity;
    /** How laggy vs. precise is the mimicking [0-1]. */
    Stiffness: number;
}

export function mimic(Target: Entity, Stiffness: number = 0.1) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Mimic;
        game.World.Mimic[entity] = {
            Target,
            Stiffness,
        };
    };
}
