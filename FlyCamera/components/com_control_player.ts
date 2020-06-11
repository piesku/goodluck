import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface ControlPlayer {
    Move: boolean;
    Pitch: number;
    Yaw: number;
}

/**
 * The ControlPlayer mixin.
 *
 * @param Move - Whether to control the entity's movement.
 * @param Yaw - Sensitivity of yaw control.
 * @param Pitch - Sensitivity of pitch control.
 */
export function control_player(move: boolean, yaw: number, pitch: number) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.ControlPlayer;
        game.World.ControlPlayer[entity] = {
            Move: move,
            Yaw: yaw,
            Pitch: pitch,
        };
    };
}
