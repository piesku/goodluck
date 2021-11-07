import {invert, ortho, perspective} from "./mat4.js";
import {Mat4} from "./math.js";

export type Projection = ProjectionPerspective | ProjectionOrtho;

export const enum ProjectionKind {
    Perspective,
    Ortho,
}

export interface ProjectionPerspective {
    Kind: ProjectionKind.Perspective;
    FovY: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    Inverse: Mat4;
}

export interface ProjectionOrtho {
    Kind: ProjectionKind.Ortho;
    Radius: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    Inverse: Mat4;
}

export function resize_perspective(projection: ProjectionPerspective, aspect: number) {
    if (aspect > 1) {
        // Landscape orientation.
        perspective(
            projection.Projection,
            projection.FovY,
            aspect,
            projection.Near,
            projection.Far
        );
    } else {
        // Portrait orientation.
        perspective(
            projection.Projection,
            projection.FovY / aspect,
            aspect,
            projection.Near,
            projection.Far
        );
    }
    invert(projection.Inverse, projection.Projection);
}

export function resize_ortho(projection: ProjectionOrtho, aspect: number) {
    if (aspect > 1) {
        // Landscape orientation.
        ortho(
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
        ortho(
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
    projection: ProjectionOrtho,
    aspect: number,
    viewport_height: number,
    unit_size_in_px: number
) {
    let radius_in_units = viewport_height / unit_size_in_px / 2;
    ortho(
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
