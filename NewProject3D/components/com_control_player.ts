import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface ControlPlayer {
    Move: boolean;
    Yaw: number;
    Pitch: number;
}

/**
 * The ControlPlayer mixin.
 *
 * When setting pitch to non-zero, yaw must be set to zero. Only then can the
 * control systems properly clamp the pitch.
 *
 * @param Move - Whether to control the entity's movement.
 * @param Yaw - Sensitivity of the yaw control. 1 means that 1 pixel traveled
 * by the mouse is equal to 1° of rotation; that's too sensitive usually.
 * @param Pitch - Sensitivity of the pitch control. 1 means that 1 pixel traveled
 * by the mouse is equal to 1° of rotation; that's too sensitive usually.
 */
export function control_player(move: boolean, yaw: number, pitch: number) {
    if (yaw && pitch) {
        throw new Error("Yaw must be zero when pitch is non-zero.");
    }

    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlPlayer;
        game.World.ControlPlayer[entity] = {
            Move: move,
            Yaw: yaw,
            Pitch: pitch,
        };
    };
}
