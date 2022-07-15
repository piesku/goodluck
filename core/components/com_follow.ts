/**
 * @module components/com_follow
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Follow {
    /** Entity whose transform to follow. */
    Target: Entity;
    /** How laggy vs. precise is the following [0-1]. */
    Stiffness: number;
}

export function follow(target: Entity, stiffness = 0.1) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Follow;
        game.World.Follow[entity] = {
            Target: target,
            Stiffness: stiffness,
        };
    };
}
