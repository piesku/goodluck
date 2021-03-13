import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface ControlSpawn {
    readonly Frequency: number;
    readonly Spread: number;
    SinceLast: number;
}

export function control_spawn(Frequency: number, Spread: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlSpawn;
        game.World.ControlSpawn[entity] = {
            Frequency,
            Spread,
            SinceLast: Frequency,
        };
    };
}
