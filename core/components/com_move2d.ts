/**
 * @module components/com_move2d
 */

import {Deg, Vec2} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Move2D {
    /** Movement speed, in units per second. */
    MoveSpeed: number;
    /** Rotation speed, in degrees per second. */
    RotationSpeed: Deg;
    /** Movement direction in self space. */
    Direction: Vec2;
    /** Rotation on Z; 1 = CCW, -1 = CW. */
    Rotation: Deg;
}

/**
 * The Move mixin.
 *
 * @param move_speed - Movement speed in units per second.
 * @param rotation_speed - Rotation speed, in degrees per second.
 */
export function move2d(move_speed: number, rotation_speed: Deg) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Move2D;
        game.World.Move2D[entity] = {
            MoveSpeed: move_speed,
            RotationSpeed: rotation_speed,
            Direction: [0, 0],
            Rotation: 0,
        };
    };
}
