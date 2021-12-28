import {create, from_ortho, from_perspective, invert} from "./mat4.js";
import {Mat4} from "./math.js";

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

export function perspective(fovy: number, near: number, far: number): ProjectionPerspective {
    return {
        Kind: ProjectionKind.Perspective,
        FovY: fovy,
        Near: near,
        Far: far,
        Projection: create(),
        Inverse: create(),
    };
}

export function resize_perspective(projection: ProjectionPerspective, aspect: number) {
    if (aspect > 1) {
        // Landscape orientation.
        from_perspective(
            projection.Projection,
            projection.FovY,
            aspect,
            projection.Near,
            projection.Far
        );
    } else {
        // Portrait orientation.
        from_perspective(
            projection.Projection,
            projection.FovY / aspect,
            aspect,
            projection.Near,
            projection.Far
        );
    }
    invert(projection.Inverse, projection.Projection);
}

export interface ProjectionOrthographic {
    Kind: ProjectionKind.Orthographic;
    Radius: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    Inverse: Mat4;
}

export function orthographic(radius: number, near: number, far: number): ProjectionOrthographic {
    return {
        Kind: ProjectionKind.Orthographic,
        Radius: radius,
        Near: near,
        Far: far,
        Projection: create(),
        Inverse: create(),
    };
}

export function resize_ortho(projection: ProjectionOrthographic, aspect: number) {
    if (aspect > 1) {
        // Landscape orientation.
        from_ortho(
            projection.Projection,
            projection.Radius / aspect,
            projection.Radius,
            -projection.Radius / aspect,
            -projection.Radius,
            projection.Near,
            projection.Far
        );
    } else {
        // Portrait orientation.
        from_ortho(
            projection.Projection,
            projection.Radius,
            projection.Radius * aspect,
            -projection.Radius,
            -projection.Radius * aspect,
            projection.Near,
            projection.Far
        );
    }
    invert(projection.Inverse, projection.Projection);
}

export function resize_ortho_keeping_unit_size(
    projection: ProjectionOrthographic,
    aspect: number,
    viewport_height: number,
    unit_size_in_px: number
) {
    let radius_in_units = viewport_height / unit_size_in_px / 2;
    from_ortho(
        projection.Projection,
        radius_in_units,
        radius_in_units * aspect,
        -radius_in_units,
        -radius_in_units * aspect,
        projection.Near,
        projection.Far
    );
    invert(projection.Inverse, projection.Projection);
}
