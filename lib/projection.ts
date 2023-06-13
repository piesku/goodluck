import {mat4_create} from "./mat4.js";
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
        Projection: mat4_create(),
        Inverse: mat4_create(),
    };
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
 * @param radius The radius of the projection: [left, top].
 * @param near The near clipping plane.
 * @param far The far clipping plane.
 */
export function orthographic(radius: Vec2, near: number, far: number): ProjectionOrthographic {
    return {
        Kind: ProjectionKind.Orthographic,
        Radius: radius,
        Near: near,
        Far: far,
        Projection: mat4_create(),
        Inverse: mat4_create(),
    };
}
