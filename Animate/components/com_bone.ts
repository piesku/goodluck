import {create} from "../../common/mat4.js";
import {Mat4} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface Bone {
    Index: number;
    Dirty: boolean;
    InverseBindPose: Mat4;
}

export function bone(index: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Bone;
        game.World.Bone[entity] = {
            Index: index,
            Dirty: true,
            InverseBindPose: create(),
        };
    };
}
