import {create, from_ortho, from_perspective, invert} from "./mat4.js";
import {Mat4, Vec2} from "./math.js";

export type Projection = ProjectionPerspective | ProjectionOrthographic;

export const enum ProjectionKind {
    Perspective,
    Orthographic,
}

export interface ProjectionPerspective {
    Kind: ProjectionKind.Perspective;
    FovY: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    Inverse: Mat4;
}

/**
 * Create a perspective projection.
 *
 * @param fov_y The vertical field of view.
 * @param near The near clipping plane.
 * @param far The far clipping plane.
 */
export function perspective(fov_y: number, near: number, far: number): ProjectionPerspective {
    return {
        Kind: ProjectionKind.Perspective,
        FovY: fov_y,
        Near: near,
        Far: far,
        Projection: create(),
        Inverse: create(),
    };
}

/**
 * Resize a perspective projection.
 *
 *     let aspect = viewport_width / viewport_height;
 *     resize_perspective(camera.Projection, aspect);
 *
 * @param projection The projection to resize.
 * @param aspect The aspect ratio of the viewport.
 */
export function resize_perspective(projection: ProjectionPerspective, aspect: number) {
    if (aspect < 1) {
        // Portrait orientation.
        from_perspective(
            projection.Projection,
            projection.FovY / aspect,
            aspect,
            projection.Near,
            projection.Far
        );
    } else {
        // Landscape orientation.
        from_perspective(
            projection.Projection,
            projection.FovY,
            aspect,
            projection.Near,
            projection.Far
        );
    }
    invert(projection.Inverse, projection.Projection);
}

export interface ProjectionOrthographic {
    Kind: ProjectionKind.Orthographic;
    Radius: Vec2;
    Near: number;
    Far: number;
    Projection: Mat4;
    Inverse: Mat4;
}

/**
 * Create an orthographic projection.
 *
 * As a special case, if the radius is [0, 0], sys_resize2d will dynamically
 * resize the projection to keep the unit size in pixels constant.
 *
 * @param radius The radius of the projection: [top, left].
 * @param near The near clipping plane.
 * @param far The far clipping plane.
 */
export function orthographic(radius: Vec2, near: number, far: number): ProjectionOrthographic {
    return {
        Kind: ProjectionKind.Orthographic,
        Radius: radius,
        Near: near,
        Far: far,
        Projection: create(),
        Inverse: create(),
    };
}

/**
 * Resize an orthographic projection.
 *
 *     let aspect = viewport_width / viewport_height;
 *     resize_ortho(camera.Projection, aspect);
 *
 * @param projection The projection to resize.
 * @param aspect The aspect ratio of the viewport.
 */
export function resize_ortho(projection: ProjectionOrthographic, aspect: number) {
    let target_aspect = projection.Radius[0] / projection.Radius[1];
    if (aspect < target_aspect) {
        // Portrait orientation.
        from_ortho(
            projection.Projection,
            projection.Radius[0] / aspect,
            projection.Radius[0],
            -projection.Radius[0] / aspect,
            -projection.Radius[0],
            projection.Near,
            projection.Far
        );
    } else {
        // Landscape orientation.
        from_ortho(
            projection.Projection,
            projection.Radius[1],
            projection.Radius[1] * aspect,
            -projection.Radius[1],
            -projection.Radius[1] * aspect,
            projection.Near,
            projection.Far
        );
    }
    invert(projection.Inverse, projection.Projection);
}

/**
 * Resize an orthographic projection using a user-defined radius.
 *
 * Ignore projection.Radius and instead apply a user-defined radius which can be
 * dynamically computed taking into account the world unit size in pixels. This
 * is useful for keeping the unit size constant across different viewport
 * dimensions, and help pixel art sprites look crisp.
 *
 *     let radius = viewport_height / unit_size_px / 2;
 *     let aspect = viewport_width / viewport_height;
 *     resize_ortho_constant(camera.Projection, radius, aspect);
 *
 * @param projection The projection to resize.
 * @param radius_y The Y radius (= top = bottom) to override projection.Radius.
 * @param aspect The aspect ratio of the viewport.
 */
export function resize_ortho_constant(
    projection: ProjectionOrthographic,
    radius_y: number,
    aspect: number
) {
    from_ortho(
        projection.Projection,
        radius_y,
        radius_y * aspect,
        -radius_y,
        -radius_y * aspect,
        projection.Near,
        projection.Far
    );
    invert(projection.Inverse, projection.Projection);
}
