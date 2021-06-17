import {multiply} from "../../common/mat4.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Bone | Has.Transform;

// This is an optional system which computes inverse bind pose matrices based on
// the initial transforms of the bones. sys_rig must run after sys_transform.
// For small rigs it's typically preferred to pass the precomputed matrices
// directly into the bone mixin. Most 3D software is capable of exporting them
// (sometimes under the name of offset matrices), or you can enable sys_rig once
// and preview the values in game.World.Bone.
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
