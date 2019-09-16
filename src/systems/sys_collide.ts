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
    let all_colliders: Collide[] = [];
    let dyn_colliders: Collide[] = [];
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            let transform = game[Get.Transform][i];
            let collider = game[Get.Collide][i];
            all_colliders.push(collider);

            // Prepare the collider for this tick's detection.
            collider.Collisions.length = 0;
            if (collider.New) {
                collider.New = false;
                compute_aabb(transform, collider);
            } else if (collider.Dynamic) {
                compute_aabb(transform, collider);
                dyn_colliders.push(collider);
            }
        }
    }

    for (let i = 0; i < dyn_colliders.length; i++) {
        check_collisions(dyn_colliders[i], all_colliders);
    }
}

/**
 * Check for collisions between a dynamic collider and all others.
 *
 * @param game The game instance.
 * @param collider The current collider.
 * @param colliders All other colliders.
 */
function check_collisions(collider: Collide, colliders: Collide[]) {
    for (let i = 0; i < colliders.length; i++) {
        let other = colliders[i];
        if (collider !== other) {
            let hit = intersect_aabb(collider, other);
            if (hit) {
                collider.Collisions.push({
                    Other: other,
                    Hit: hit,
                });
                other.Collisions.push({
                    Other: collider,
                    Hit: negate([], hit),
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
    get_translation(collide.Center, transform.World);

    // Start with the extents on each axis set to the position of the center.
    let min_x, min_y, min_z, max_x, max_y, max_z;
    min_x = max_x = collide.Center[0];
    min_y = max_y = collide.Center[1];
    min_z = max_z = collide.Center[2];

    // Expand the extents outwards from the center by finding the farthest
    // vertex on each axis in both the negative and the positive direction.
    let world_vertex: Vec3 = [];
    for (let i = 0; i < 8; i++) {
        let bb_vertex = BOX[i];

        // Scale the bounding box according to the size of the collider.
        world_vertex[0] = bb_vertex[0] * collide.Size[0];
        world_vertex[1] = bb_vertex[1] * collide.Size[1];
        world_vertex[2] = bb_vertex[2] * collide.Size[2];

        transform_mat4(world_vertex, world_vertex, transform.World);
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
    collide.Half[0] = (max_x - min_x) / 2;
    collide.Half[1] = (max_y - min_y) / 2;
    collide.Half[2] = (max_z - min_z) / 2;
}

function intersect_aabb(a: Collide, b: Collide): Vec3 | null {
    let distance_x = a.Center[0] - b.Center[0];
    let penetration_x = a.Half[0] + b.Half[0] - Math.abs(distance_x);
    if (penetration_x <= 0) {
        return null;
    }

    let distance_y = a.Center[1] - b.Center[1];
    let penetration_y = a.Half[1] + b.Half[1] - Math.abs(distance_y);
    if (penetration_y <= 0) {
        return null;
    }

    let distance_z = a.Center[2] - b.Center[2];
    let penetration_z = a.Half[2] + b.Half[2] - Math.abs(distance_z);
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