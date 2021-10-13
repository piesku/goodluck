import {get_scaling, get_translation} from "./mat4.js";
import {Mat4, Vec3} from "./math.js";
import {add, scale, subtract, transform_position} from "./vec3.js";

export interface AABB {
    /** The size of the collider in self units. */
    Size: [x: number, y: number, z: number];
    /** The min corner of the AABB. */
    Min: Vec3;
    /** The max corner of the AABB. */
    Max: Vec3;
    /** The world position of the AABB. */
    Center: Vec3;
    /** The half-extents of the AABB on the three axes. */
    Half: [x: number, y: number, z: number];
}

const BOX: Array<Vec3> = [
    [0.5, 0.5, 0.5],
    [0.5, 0.5, -0.5],
    [-0.5, 0.5, -0.5],
    [-0.5, 0.5, 0.5],
    [0.5, -0.5, 0.5],
    [0.5, -0.5, -0.5],
    [-0.5, -0.5, -0.5],
    [-0.5, -0.5, 0.5],
];

/**
 * Computes the AABB based on the translation, rotation and scale of the
 * transform. This is the most accurate function from the compute_aabb family.
 */
export function compute_aabb(world: Mat4, aabb: AABB) {
    get_translation(aabb.Center, world);

    // Start with the extents on each axis set to the position of the center.
    let min_x, min_y, min_z, max_x, max_y, max_z;
    min_x = max_x = aabb.Center[0];
    min_y = max_y = aabb.Center[1];
    min_z = max_z = aabb.Center[2];

    // Expand the extents outwards from the center by finding the farthest
    // vertex on each axis in both the negative and the positive direction.
    let world_vertex: Vec3 = [0, 0, 0];
    for (let i = 0; i < 8; i++) {
        let bb_vertex = BOX[i];

        // Scale the bounding box according to the size of the collider.
        world_vertex[0] = bb_vertex[0] * aabb.Size[0];
        world_vertex[1] = bb_vertex[1] * aabb.Size[1];
        world_vertex[2] = bb_vertex[2] * aabb.Size[2];

        transform_position(world_vertex, world_vertex, world);
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
    aabb.Min = [min_x, min_y, min_z];
    aabb.Max = [max_x, max_y, max_z];

    // Calculate the half-extents.
    aabb.Half[0] = (max_x - min_x) / 2;
    aabb.Half[1] = (max_y - min_y) / 2;
    aabb.Half[2] = (max_z - min_z) / 2;
}

const world_scale: Vec3 = [0, 0, 0];

/**
 * Computes the AABB based on the translation and scale of the transform. It
 * assumes [0, 0, 0, 1] rotation, which is to say that the scaling will align
 * with the world's axes (e.g. the scale of [2, 1, 1] will scale the AABB on the
 * world's X axis regardless of the transform's coordinate system). For best
 * results the scaling should be uniform or the transform should not be rotated.
 */
export function compute_aabb_without_rotation(world: Mat4, aabb: AABB) {
    get_translation(aabb.Center, world);
    get_scaling(world_scale, world);

    // Calculate the half-extents.
    aabb.Half[0] = (aabb.Size[0] / 2) * world_scale[0];
    aabb.Half[1] = (aabb.Size[1] / 2) * world_scale[1];
    aabb.Half[2] = (aabb.Size[2] / 2) * world_scale[2];

    // Save the min and max bounds.
    subtract(aabb.Min, aabb.Center, aabb.Half);
    add(aabb.Max, aabb.Center, aabb.Half);
}

/**
 * Computes the AABB based on the translation of the transform and the Size
 * property of the collider. This is the simplest function from the compute_aabb
 * family and requires the collider to have a Size property.
 */
export function compute_aabb_without_rotation_scale(world: Mat4, aabb: AABB) {
    get_translation(aabb.Center, world);

    // Calculate the half-extents.
    scale(aabb.Half, aabb.Size, 0.5);

    // Save the min and max bounds.
    subtract(aabb.Min, aabb.Center, aabb.Half);
    add(aabb.Max, aabb.Center, aabb.Half);
}

export function penetrate_aabb(a: AABB, b: AABB): Vec3 {
    let distance_x = a.Center[0] - b.Center[0];
    let penetration_x = a.Half[0] + b.Half[0] - Math.abs(distance_x);

    let distance_y = a.Center[1] - b.Center[1];
    let penetration_y = a.Half[1] + b.Half[1] - Math.abs(distance_y);

    let distance_z = a.Center[2] - b.Center[2];
    let penetration_z = a.Half[2] + b.Half[2] - Math.abs(distance_z);

    if (penetration_x < penetration_y && penetration_x < penetration_z) {
        return [penetration_x * Math.sign(distance_x), 0, 0];
    } else if (penetration_y < penetration_z) {
        return [0, penetration_y * Math.sign(distance_y), 0];
    } else {
        return [0, 0, penetration_z * Math.sign(distance_z)];
    }
}

export function intersect_aabb(a: AABB, b: AABB) {
    return (
        a.Min[0] < b.Max[0] &&
        a.Max[0] > b.Min[0] &&
        a.Min[1] < b.Max[1] &&
        a.Max[1] > b.Min[1] &&
        a.Min[2] < b.Max[2] &&
        a.Max[2] > b.Min[2]
    );
}
