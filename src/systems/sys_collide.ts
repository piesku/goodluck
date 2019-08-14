import {Collide} from "../components/com_collide.js";
import {Get} from "../components/com_index.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {get_translation} from "../math/mat4.js";
import {negate, transform_mat4} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Collide);

export function sys_collide(game: Game, delta: number) {
    // Collect all colliders.
    let colliders: Collide[] = [];
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            let transform = game[Get.Transform][i];
            let collider = game[Get.Collide][i];
            colliders.push(collider);

            // Prepare the collider for this tick's detection.
            collider.collisions.length = 0;
            if (collider.new) {
                collider.new = false;
                compute_aabb(transform, collider);
            } else if (collider.dynamic) {
                compute_aabb(transform, collider);
            }
        }
    }

    for (let i = 0; i < colliders.length; i++) {
        check_collisions(colliders[i], colliders, i);
    }
}

/**
 * Check for collisions between the current collider and all others. Because
 * collisions are symmetric, it's sufficient to check only the upper-right half
 * of the n x n matrix of colliders.
 *
 * @param game The game instance.
 * @param collider The current collider.
 * @param colliders All other colliders.
 * @param max_index The number of colliders to check.
 */
function check_collisions(collider: Collide, colliders: Collide[], max_index: number) {
    for (let i = 0; i < max_index; i++) {
        let other = colliders[i];
        if (collider.dynamic || other.dynamic) {
            let hit = intersect_aabb(collider, other);
            if (hit) {
                collider.collisions.push({
                    other,
                    hit,
                });
                other.collisions.push({
                    other: collider,
                    hit: negate([], hit),
                });
            }
        }
    }
}

const BOX = [
    [0.5, 0.5, 0.5],
    [0.5, 0.5, -0.5],
    [-0.5, 0.5, -0.5],
    [-0.5, 0.5, 0.5],
    [0.5, -0.5, 0.5],
    [0.5, -0.5, -0.5],
    [-0.5, -0.5, -0.5],
    [-0.5, -0.5, 0.5],
];

function compute_aabb(transform: Transform, collide: Collide) {
    get_translation(collide.center, transform.world);

    // Start with the extents on each axis set to the position of the center.
    let min_x, min_y, min_z, max_x, max_y, max_z;
    min_x = max_x = collide.center[0];
    min_y = max_y = collide.center[1];
    min_z = max_z = collide.center[2];

    // Expand the extents outwards from the center by finding the farthest
    // vertex on each axis in both the negative and the positive direction.
    let world_vertex: Vec3 = [];
    for (let i = 0; i < 8; i++) {
        let bb_vertex = BOX[i];

        // Scale the bounding box according to the size of the collider.
        world_vertex[0] = bb_vertex[0] * collide.size[0];
        world_vertex[1] = bb_vertex[1] * collide.size[1];
        world_vertex[2] = bb_vertex[2] * collide.size[2];

        transform_mat4(world_vertex, world_vertex, transform.world);
        if (world_vertex[0] < min_x) {
            min_x = world_vertex[0];
        }
        if (world_vertex[0] > max_x) {
            max_x = world_vertex[0];
        }
        if (world_vertex[1] < min_y) {
            min_y = world_vertex[1];
        }
        if (world_vertex[1] > max_y) {
            max_y = world_vertex[1];
        }
        if (world_vertex[2] < min_z) {
            min_z = world_vertex[2];
        }
        if (world_vertex[2] > max_z) {
            max_z = world_vertex[2];
        }
    }

    // Calculate the half-extents.
    collide.half[0] = (max_x - min_x) / 2;
    collide.half[1] = (max_y - min_y) / 2;
    collide.half[2] = (max_z - min_z) / 2;
}

function intersect_aabb(a: Collide, b: Collide): Vec3 | null {
    let distance_x = a.center[0] - b.center[0];
    let penetration_x = a.half[0] + b.half[0] - Math.abs(distance_x);
    if (penetration_x <= 0) {
        return null;
    }

    let distance_y = a.center[1] - b.center[1];
    let penetration_y = a.half[1] + b.half[1] - Math.abs(distance_y);
    if (penetration_y <= 0) {
        return null;
    }

    let distance_z = a.center[2] - b.center[2];
    let penetration_z = a.half[2] + b.half[2] - Math.abs(distance_z);
    if (penetration_z <= 0) {
        return null;
    }

    if (penetration_x < penetration_y && penetration_x < penetration_z) {
        return <Vec3>[penetration_x * Math.sign(distance_x), 0, 0];
    } else if (penetration_y < penetration_z) {
        return <Vec3>[0, penetration_y * Math.sign(distance_y), 0];
    } else {
        return <Vec3>[0, 0, penetration_z * Math.sign(distance_z)];
    }
}
