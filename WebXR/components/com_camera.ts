import {create} from "../../common/mat4.js";
import {Mat4} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export type Camera = CameraPerspective | CameraXr;
export const enum CameraKind {
    Perspective,
    Xr,
}

export interface CameraPerspective {
    Kind: CameraKind.Perspective;
    FovY: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    Pv: Mat4;
}

export function camera_persp(fovy: number, near: number, far: number) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Perspective,
            FovY: fovy,
            Near: near,
            Far: far,
            Projection: create(),
            Pv: create(),
        };
    };
}

export interface CameraEye {
    View: XRView;
    Pv: Mat4;
}

export interface CameraXr {
    Kind: CameraKind.Xr;
    Eyes: Array<CameraEye>;
}

export function camera_xr() {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Xr,
            Eyes: [],
        };
    };
}
