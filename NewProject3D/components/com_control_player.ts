import {Vec2} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface ControlPlayer {
    Move: boolean;
    Yaw: number;
    Pitch: number;
    PitchRange: Vec2;
}

/**
 * The ControlPlayer mixin.
 *
 * @param move - Whether to control the entity's movement.
 * @param yaw - Sensitivity of the yaw control. 1 means that 1 pixel traveled
 * by the mouse is equal to 1° of rotation; that's too sensitive usually.
 * @param pitch - Sensitivity of the pitch control. 1 means that 1 pixel traveled
 * by the mouse is equal to 1° of rotation; that's too sensitive usually.
 * @param pitch_range - Min and max allowed pitch, in arc degrees.
 */
export function control_player(move: boolean, yaw: number, pitch: number, pitch_range: Vec2) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlPlayer;
        game.World.ControlPlayer[entity] = {
            Move: move,
            Yaw: yaw,
            Pitch: pitch,
            PitchRange: pitch_range,
        };
    };
}
