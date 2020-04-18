import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export interface ControlPlayer {
    Move: boolean;
    Pitch: boolean;
    Yaw: boolean;
    Sensitivity: number;
}

/**
 * The ControlPlayer mixin.
 *
 * @param Move - Whether to control the entity's movement.
 * @param Yaw - Whether to control the entity's yaw.
 * @param Pitch - Whether to control the entity's pitch.
 * @param Sensitivity - Mouse sensitivity on both axes.
 */
export function control_player(Move: boolean, Yaw: boolean, Pitch: boolean, Sensitivity: number) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.ControlPlayer;
        game.World.ControlPlayer[entity] = {
            Move,
            Yaw,
            Pitch,
            Sensitivity,
        };
    };
}
