import {Quat, Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface Move {
    /** Movement speed, in units per second. */
    readonly MoveSpeed: number;
    /** Rotation speed, in radians per second. */
    readonly RotationSpeed: number;
    /** Movement directions in self space, normalized. */
    Directions: Array<Vec3>;
    /** Rotations applied in the local space (pre-multiplied). */
    LocalRotations: Array<Quat>;
    /** Rotations applied in the self space (post-multiplied). */
    SelfRotations: Array<Quat>;
}

/**
 * The Move mixin.
 *
 * @param move_speed - Movement speed in units per second.
 * @param rotation_speed - Rotation speed, in radians per second.
 */
export function move(move_speed: number, rotation_speed: number) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Move;
        game.World.Move[entity] = {
            MoveSpeed: move_speed,
            RotationSpeed: rotation_speed,
            Directions: [],
            LocalRotations: [],
            SelfRotations: [],
        };
    };
}
