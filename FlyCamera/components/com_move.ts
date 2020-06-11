import {Quat, Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface Move {
    /** Movement speed, in units per second. */
    readonly MoveSpeed: number;
    /** Rotation responsiveness, used for lerping quaternions. */
    readonly RotateSpeed: number;
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
 * @param MoveSpeed - Movement speed in units per second.
 * @param RotateSpeed - Rotation responsiveness, unitless. Larger values make
 * the entity rotate faster towards the target orientation. Set `Infinity` to
 * snap the entity instantly into the target orientation.
 */
export function move(MoveSpeed: number, RotateSpeed: number) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Move;
        game.World.Move[entity] = {
            MoveSpeed,
            RotateSpeed,
            Directions: [],
            LocalRotations: [],
            SelfRotations: [],
        };
    };
}
