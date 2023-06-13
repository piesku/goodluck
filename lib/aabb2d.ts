import {mat2d_get_translation} from "./mat2d.js";
import {Mat2D, Vec2} from "./math.js";

export interface AABB2D {
    /** The size of the collider in self units. */
    Size: [x: number, y: number];
    /** The min corner of the AABB. */
    Min: Vec2;
    /** The max corner of the AABB. */
    Max: Vec2;
    /** The world position of the AABB. */
    Center: Vec2;
}

/**
 * Compute the AABB based on the translation of the transform and the Size
 * property of the collider.
 *
 * This is the simplest function from the compute_aabb family and requires the
 * collider to have a Size property.
 */
export function compute_aabb_without_rotation_scale(world: Mat2D, aabb: AABB2D) {
    mat2d_get_translation(aabb.Center, world);
    aabb.Min[0] = aabb.Center[0] - aabb.Size[0] / 2;
    aabb.Min[1] = aabb.Center[1] - aabb.Size[1] / 2;
    aabb.Max[0] = aabb.Center[0] + aabb.Size[0] / 2;
    aabb.Max[1] = aabb.Center[1] + aabb.Size[1] / 2;
}

export function intersect_aabb(a: AABB2D, b: AABB2D) {
    return a.Min[0] < b.Max[0] && a.Max[0] > b.Min[0] && a.Min[1] < b.Max[1] && a.Max[1] > b.Min[1];
}

export function penetrate_aabb(a: AABB2D, b: AABB2D): Vec2 {
    let distance_x = a.Center[0] - b.Center[0];
    let penetration_x = a.Size[0] / 2 + b.Size[0] / 2 - Math.abs(distance_x);

    let distance_y = a.Center[1] - b.Center[1];
    let penetration_y = a.Size[1] / 2 + b.Size[1] / 2 - Math.abs(distance_y);

    if (penetration_x < penetration_y) {
        return [penetration_x * Math.sign(distance_x), 0];
    } else {
        return [0, penetration_y * Math.sign(distance_y)];
    }
}
