import {create} from "../../common/mat4.js";
import {Mat4} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export type Camera = CameraPerspective | CameraVr;
export const enum CameraKind {
    Perspective,
    Vr,
}

export interface CameraPerspective {
    Kind: CameraKind.Perspective;
    FOVy: number;
    Near: number;
    Far: number;
    Projection: Mat4;
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
            PV: create(),
        };
    };
}

export interface CameraVr {
    Kind: CameraKind.Vr;
    PvLeft: Mat4;
    PvRight: Mat4;
}

export function camera_vr() {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Camera;
        game.World.Camera[entity] = <Camera>{
            Kind: CameraKind.Vr,
            PvLeft: create(),
            PvRight: create(),
        };
    };
}
