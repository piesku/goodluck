import {get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {negate, transform_point} from "../../common/vec3.js";
import {Collide} from "../components/com_collide.js";
import {Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Collide;

export function sys_collide(game: Game, delta: number) {
    // Collect all colliders.
    let static_colliders: Collide[] = [];
    let dynamic_colliders: Collide[] = [];
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            let transform = game.World.Transform[i];
            let collider = game.World.Collide[i];

            // Prepare the collider for this tick's detection.
            collider.Collisions = [];
            if (collider.New) {
                collider.New = false;
                compute_aabb(transform, collider);
            } else if (collider.Dynamic) {
                compute_aabb(transform, collider);
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
        if (intersect_aabb(collider, other)) {
            let hit = penetrate_aabb(collider, other);
            collider.Collisions.push({
                Other: other.Entity,
                Hit: hit,
            });
            other.Collisions.push({
                Other: collider.Entity,
                Hit: negate([0, 0, 0], hit),
            });
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
    let world_vertex = <Vec3>[0, 0, 0];
    for (let i = 0; i < 8; i++) {
        let bb_vertex = BOX[i];

        // Scale the bounding box according to the size of the collider.
        world_vertex[0] = bb_vertex[0] * collide.Size[0];
        world_vertex[1] = bb_vertex[1] * collide.Size[1];
        world_vertex[2] = bb_vertex[2] * collide.Size[2];

        transform_point(world_vertex, world_vertex, transform.World);
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

    // Save the min and max bounds.
    collide.Min = [min_x, min_y, min_z];
    collide.Max = [max_x, max_y, max_z];

    // Calculate the half-extents.
    collide.Half[0] = (max_x - min_x) / 2;
    collide.Half[1] = (max_y - min_y) / 2;
    collide.Half[2] = (max_z - min_z) / 2;
}

function penetrate_aabb(a: Collide, b: Collide) {
    let distance_x = a.Center[0] - b.Center[0];
    let penetration_x = a.Half[0] + b.Half[0] - Math.abs(distance_x);

    let distance_y = a.Center[1] - b.Center[1];
    let penetration_y = a.Half[1] + b.Half[1] - Math.abs(distance_y);

    let distance_z = a.Center[2] - b.Center[2];
    let penetration_z = a.Half[2] + b.Half[2] - Math.abs(distance_z);

    if (penetration_x < penetration_y && penetration_x < penetration_z) {
        return <Vec3>[penetration_x * Math.sign(distance_x), 0, 0];
    } else if (penetration_y < penetration_z) {
        return <Vec3>[0, penetration_y * Math.sign(distance_y), 0];
    } else {
        return <Vec3>[0, 0, penetration_z * Math.sign(distance_z)];
    }
}

function intersect_aabb(a: Collide, b: Collide) {
    return (
        a.Min[0] < b.Max[0] &&
        a.Max[0] > b.Min[0] &&
        a.Min[1] < b.Max[1] &&
        a.Max[1] > b.Min[1] &&
        a.Min[2] < b.Max[2] &&
        a.Max[2] > b.Min[2]
    );
}
