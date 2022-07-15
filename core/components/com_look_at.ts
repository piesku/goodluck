/**
 * @module components/com_look_at
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface LookAt {
    /** Entity to look at. */
    Target: Entity;
    /** How laggy vs. precise is the following [0-1]. */
    Stiffness: number;
}

export function look_at(target: Entity, stiffness = 0.1) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.LookAt;
        game.World.LookAt[entity] = {
            Target: target,
            Stiffness: stiffness,
        };
    };
}
