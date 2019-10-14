import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface Shake {
    Duration: number;
}

/**
 * sys_shake modifies the transform of the entity. Add it to children only.
 */
export function shake(Duration = 0) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.Shake;
        game[Get.Shake][entity] = <Shake>{
            Duration,
        };
    };
}
