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

    if (DEBUG && transform.Parent === undefined) {
        throw new Error("(sys_rig) Bones must not be top-level entities.");
    }

    if (bone.Dirty && transform.Parent) {
        bone.Dirty = false;

        if (game.World.Signature[transform.Parent] & Has.Bone) {
            let parent_bone = game.World.Bone[transform.Parent];
            let parent_transform = game.World.Transform[transform.Parent];
            multiply(bone.InverseBindPose, parent_transform.World, parent_bone.InverseBindPose);
            multiply(bone.InverseBindPose, transform.Self, bone.InverseBindPose);
        } else {
            // `bone` is the root bone parented at the mesh.
            let parent_transform = game.World.Transform[transform.Parent];
            multiply(bone.InverseBindPose, transform.Self, parent_transform.World);
        }
    }
}
