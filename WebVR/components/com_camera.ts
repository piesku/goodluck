import {create} from "../../common/mat4.js";
import {Mat4} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export type Camera = CameraPersp | CameraVr;
export const enum CameraKind {
    Perspective,
    Vr,
}

interface CameraPersp {
    Kind: CameraKind.Perspective;
    FOVy: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    View: Mat4;
    PV: Mat4;
}

export function camera_persp(fovy: number, near: number, far: number) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Camera;
        game.World.Camera[entity] = <Camera>{
            Kind: CameraKind.Perspective,
            FOVy: fovy,
            Near: near,
            Far: far,
            Projection: create(),
            View: create(),
            PV: create(),
        };
    };
}

export const enum Eye {
    Left,
    Right,
}

interface CameraVr {
    Kind: CameraKind.Vr;
    Eye: Eye;
    PV: Mat4;
}

export function camera_vr(eye: Eye) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Camera;
        game.World.Camera[entity] = <Camera>{
            Kind: CameraKind.Vr,
            Eye: eye,
            PV: create(),
        };
    };
}
