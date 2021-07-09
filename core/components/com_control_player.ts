import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface ControlPlayer {
    Move: boolean;
    Yaw: number;
    Pitch: number;
    MinPitch: number;
    MaxPitch: number;
}

/**
 * The ControlPlayer mixin.
 *
 * @param move - Whether to control the entity's movement.
 * @param yaw - Sensitivity of the yaw control. 1 means that 1 pixel traveled
 * by the mouse is equal to 1° of rotation; that's too sensitive usually.
 * @param pitch - Sensitivity of the pitch control. 1 means that 1 pixel traveled
 * by the mouse is equal to 1° of rotation; that's too sensitive usually.
 * @param min_pitch - Min pitch allowed, in arc degrees.
 * @param max_pitch - Max pitch allowed, in arc degrees.
 */
export function control_player(
    move: boolean,
    yaw: number,
    pitch: number,
    min_pitch = 0,
    max_pitch = 0
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlPlayer;
        game.World.ControlPlayer[entity] = {
            Move: move,
            Yaw: yaw,
            Pitch: pitch,
            MinPitch: min_pitch,
            MaxPitch: max_pitch,
        };
    };
}
