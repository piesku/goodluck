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
