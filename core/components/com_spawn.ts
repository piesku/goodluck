/**
 * @module components/com_spawn
 */

import {Blueprint} from "../../common/game.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

interface Creator {
    (game: Game): Blueprint<Game>;
}

export interface Spawn {
    Creator: Creator;
    Interval: number;
    SinceLast: number;
}

/**
 * Spawn blueprints with a given frequency.
 *
 * @param creator The function returning the blueprint to spawn.
 * @param interval The frequency of spawning.
 */
export function spawn(creator: Creator, interval: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Spawn;
        game.World.Spawn[entity] = {
            Creator: creator,
            Interval: interval,
            SinceLast: interval,
        };
    };
}
