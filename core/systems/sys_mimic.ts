/**
 * # sys_mimic
 *
 * Update the entity's position and rotation to mimic another entity.
 */

import {get_rotation, get_translation} from "../../lib/mat4.js";
import {Quat, Vec3} from "../../lib/math.js";
import {slerp} from "../../lib/quat.js";
import {lerp} from "../../lib/vec3.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Mimic;

export function sys_mimic(game: Game, delta: number) {
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            update(game, ent);
        }
    }
}

let target_position: Vec3 = [0, 0, 0];
let target_rotation: Quat = [0, 0, 0, 1];

function update(game: Game, entity: Entity) {
    // Follower must be a top-level transform for this to work.
    let transform = game.World.Transform[entity];
    let mimic = game.World.Mimic[entity];
    let target_transform = game.World.Transform[mimic.Target];

    get_translation(target_position, target_transform.World);
    get_rotation(target_rotation, target_transform.World);

    lerp(transform.Translation, transform.Translation, target_position, mimic.Stiffness);
    slerp(transform.Rotation, transform.Rotation, target_rotation, mimic.Stiffness);

    game.World.Signature[entity] |= Has.Dirty;
}
