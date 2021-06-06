import {multiply} from "../../common/mat4.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Bone | Has.Transform;

export function sys_rig(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let bone = game.World.Bone[entity];
    let transform = game.World.Transform[entity];

    if (bone.Dirty) {
        bone.Dirty = false;

        if (transform.Parent === undefined) {
            return;
        }

        if (game.World.Signature[transform.Parent] & Has.Bone) {
            let parent_bone = game.World.Bone[transform.Parent];
            let parent_transform = game.World.Transform[transform.Parent];
            multiply(bone.InverseBindPose, parent_transform.World, parent_bone.InverseBindPose);
            multiply(bone.InverseBindPose, transform.Self, bone.InverseBindPose);
        }
    }
}
