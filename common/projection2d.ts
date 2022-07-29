import {create, set} from "./mat2d.js";
import {Mat2D, Vec2} from "./math.js";

export interface Projection2D {
    Radius: Vec2;
    Projection: Mat2D;
    Inverse: Mat2D;
}

/**
 * Create an orthographic projection.
 *
 * As a special case, if the radius is [0, 0], sys_resize2d will dynamically
 * resize the projection to keep the unit size in pixels constant.
 *
 * @param radius The radius of the projection: [left, top].
 */
export function orthographic2d(radius: Vec2): Projection2D {
    return {
        Radius: radius,
        Projection: from_ortho(create(), radius[0], radius[1]),
        Inverse: create(),
    };
}

export function from_ortho(mat: Mat2D, left: number, top: number) {
    set(mat, left, 0, 0, top, 0, 0);
    return mat;
}
