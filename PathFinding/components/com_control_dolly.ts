import {Entity} from "../../common/world";
import {Game} from "../game";
import {Has} from "../world";

export interface ControlDolly {
    MoveSpeed: number;
}

/**
 * @param move_speed - Base movement speed. It will be adjusted by the current dolly level.
 */
export function control_dolly(move_speed: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlDolly;
        game.World.ControlDolly[entity] = {
            MoveSpeed: move_speed,
        };
    };
}
