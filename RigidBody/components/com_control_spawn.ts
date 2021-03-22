import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface ControlSpawn {
    Frequency: number;
    SinceLast: number;
}

export function control_spawn(frequency: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlSpawn;
        game.World.ControlSpawn[entity] = {
            Frequency: frequency,
            SinceLast: frequency,
        };
    };
}
