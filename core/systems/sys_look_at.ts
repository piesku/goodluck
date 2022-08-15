/**
 * # sys_look_at
 *
 * Update the entity's position to look at another entity.
 */

import {get_translation} from "../../lib/mat4.js";
import {Quat, Vec3} from "../../lib/math.js";
import {look_pitch, look_yaw, multiply} from "../../lib/quat.js";
import {transform_position} from "../../lib/vec3.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.LookAt;

export function sys_look_at(game: Game, delta: number) {
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            update(game, ent);
        }
    }
}

let world_position: Vec3 = [0, 0, 0];
let target_position: Vec3 = [0, 0, 0];
let rotation_to_target: Quat = [0, 0, 0, 1];

function update(game: Game, entity: Entity) {
    // Follower must be a top-level transform for this to work.
    let transform = game.World.Transform[entity];
    let look_at = game.World.LookAt[entity];
    let target_transform = game.World.Transform[look_at.Target];

    get_translation(world_position, transform.World);
    get_translation(target_position, target_transform.World);
    transform_position(target_position, target_position, transform.Self);

    look_yaw(rotation_to_target, target_position);
    multiply(transform.Rotation, rotation_to_target, transform.Rotation);

    look_pitch(rotation_to_target, target_position);
    multiply(transform.Rotation, transform.Rotation, rotation_to_target);

    game.World.Signature[entity] |= Has.Dirty;
}
