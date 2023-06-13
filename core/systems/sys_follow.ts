/**
 * # sys_follow
 *
 * Update the entity's position to follow another entity.
 */

import {mat4_get_translation} from "../../lib/mat4.js";
import {Vec3} from "../../lib/math.js";
import {vec3_lerp} from "../../lib/vec3.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Follow;

export function sys_follow(game: Game, delta: number) {
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            update(game, ent);
        }
    }
}

let target_position: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity) {
    // Follower must be a top-level transform for this to work.
    let transform = game.World.Transform[entity];
    let follow = game.World.Follow[entity];
    let target_transform = game.World.Transform[follow.Target];

    mat4_get_translation(target_position, target_transform.World);
    vec3_lerp(transform.Translation, transform.Translation, target_position, follow.Stiffness);

    game.World.Signature[entity] |= Has.Dirty;
}
