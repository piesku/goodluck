/**
 * @module components/com_control_spawn
 */

import {Blueprint} from "../../common/game.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

interface Creator {
    (game: Game): Blueprint<Game>;
}

export interface ControlSpawn {
    Creator: Creator;
    Frequency: number;
    SinceLast: number;
}

/**
 * Spawn blueprints at random intervals with the average interval of `frequency`.
 *
 * @param creator The function returning the blueprint to spawn.
 * @param frequency The average frequency of spawning.
 */
export function control_spawn(creator: Creator, frequency: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlSpawn;
        game.World.ControlSpawn[entity] = {
            Creator: creator,
            Frequency: frequency,
            SinceLast: frequency,
        };
    };
}
