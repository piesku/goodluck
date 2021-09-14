/**
 * @module systems/sys_collide
 */

import {compute_aabb, intersect_aabb, penetrate_aabb} from "../../common/aabb.js";
import {negate} from "../../common/vec3.js";
import {Collide} from "../components/com_collide.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Collide;

export function sys_collide(game: Game, delta: number) {
    // Collect all colliders.
    let static_colliders: Collide[] = [];
    let dynamic_colliders: Collide[] = [];
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let transform = game.World.Transform[i];
            let collider = game.World.Collide[i];

            // Prepare the collider for this tick's detection.
            collider.Collisions = [];
            if (collider.New) {
                collider.New = false;
                compute_aabb(transform.World, collider);
            } else if (collider.Dynamic) {
                compute_aabb(transform.World, collider);
                dynamic_colliders.push(collider);
            } else {
                static_colliders.push(collider);
            }
        }
    }

    for (let i = 0; i < dynamic_colliders.length; i++) {
        check_collisions(dynamic_colliders[i], static_colliders, static_colliders.length);
        check_collisions(dynamic_colliders[i], dynamic_colliders, i);
    }
}

/**
 * Check for collisions between a dynamic collider and other colliders. Length
 * is used to control how many colliders to check against. For collisions
 * with static colliders, length should be equal to colliders.length, since
 * we want to consider all static colliders in the scene. For collisions with
 * other dynamic colliders, we only need to check a pair of colliders once.
 * Varying length allows to skip half of the NxN checks matrix.
 *
 * @param game The game instance.
 * @param collider The current collider.
 * @param colliders Other colliders to test against.
 * @param length How many colliders to check.
 */
function check_collisions(collider: Collide, colliders: Collide[], length: number) {
    for (let i = 0; i < length; i++) {
        let other = colliders[i];
        let collider_can_intersect = collider.Mask & other.Layers;
        let other_can_intersect = other.Mask & collider.Layers;
        if (collider_can_intersect || other_can_intersect) {
            if (intersect_aabb(collider, other)) {
                let hit = penetrate_aabb(collider, other);
                if (collider_can_intersect) {
                    collider.Collisions.push({
                        Other: other.EntityId,
                        Hit: hit,
                    });
                }
                if (other_can_intersect) {
                    other.Collisions.push({
                        Other: collider.EntityId,
                        Hit: negate([0, 0, 0], hit),
                    });
                }
            }
        }
    }
}
