import {create} from "../../common/mat4.js";
import {Mat4, Vec3} from "../../common/math.js";
import {Projection, ProjectionKind} from "../../common/projection.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export type Camera = CameraForward | CameraXr;
export const enum CameraKind {
    Forward,
    Xr,
}

export interface CameraForward extends CameraEye {
    Kind: CameraKind.Forward;
    Projection: Projection;
}

export function camera_forward_perspective(fovy: number, near: number, far: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Forward,
            Projection: {
                Kind: ProjectionKind.Perspective,
                FovY: fovy,
                Near: near,
                Far: far,
                Projection: create(),
                Inverse: create(),
            },
            View: create(),
            Pv: create(),
            Position: [0, 0, 0],
        };
    };
}

export interface XrEye extends CameraEye {
    Viewpoint: XRView;
}

export interface CameraXr {
    Kind: CameraKind.Xr;
    Eyes: Array<XrEye>;
}

export function camera_xr() {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Xr,
            Eyes: [],
        };
    };
}

// The subset of camera data passed into shaders.
export interface CameraEye {
    View: Mat4;
    Pv: Mat4;
    Position: Vec3;
}
