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
        invert(projection.Inverse, projection.Projection);
    } else {
        // Portrait orientation.
        perspective(
            projection.Projection,
            projection.FovY / aspect,
            aspect,
            projection.Near,
            projection.Far
        );
        invert(projection.Inverse, projection.Projection);
    }
}

export function resize_ortho(projection: ProjectionOrtho) {
    ortho(
        projection.Projection,
        projection.Radius,
        projection.Radius,
        -projection.Radius,
        -projection.Radius,
        projection.Near,
        projection.Far
    );
    invert(projection.Inverse, projection.Projection);
}
