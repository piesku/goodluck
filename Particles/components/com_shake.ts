import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface Shake {
    Duration: number;
}

/**
 * sys_shake modifies the transform of the entity. Add it to children only.
 */
export function shake(Duration = 0) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Shake;
        game.World.Shake[entity] = {
            Duration,
        };
    };
}
