import {mat4_create} from "../../lib/mat4.js";
import {Mat4} from "../../lib/math.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Bone {
    Index: number;
    Dirty: boolean;
    InverseBindPose: Mat4;
}

export function bone(index: number, inverse_bind_pose?: Mat4) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Bone;
        game.World.Bone[entity] = {
            Index: index,
            Dirty: inverse_bind_pose === undefined,
            InverseBindPose: inverse_bind_pose || mat4_create(),
        };
    };
}
