import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface ControlSpawner {
    readonly Frequency: number;
    readonly Spread: number;
    SinceLast: number;
}

export function control_spawner(Frequency: number, Spread: number) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.ControlSpawner;
        game.World.ControlSpawner[entity] = {
            Frequency,
            Spread,
            SinceLast: Frequency,
        };
    };
}
