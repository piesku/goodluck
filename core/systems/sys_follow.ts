/**
 * @module systems/sys_follow
 */

import {get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {lerp} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
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

    get_translation(target_position, target_transform.World);
    lerp(transform.Translation, transform.Translation, target_position, follow.Stiffness);

    game.World.Signature[entity] |= Has.Dirty;
}
