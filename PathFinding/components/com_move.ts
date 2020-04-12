import {Quat, Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export interface Move {
    /** Units per second. */
    readonly MoveSpeed: number;
    /** Rotation responsiveness, used for lerping quaternions. */
    readonly RotateSpeed: number;
    /** Movement directions in self space, normalized. */
    Directions: Array<Vec3>;
    LocalRotations: Array<Quat>;
    SelfRotations: Array<Quat>;
}

export function move(MoveSpeed: number = 3.5, RotateSpeed: number = 10) {
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
