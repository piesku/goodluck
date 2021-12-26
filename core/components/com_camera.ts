/**
 * @module components/com_camera
 */

import {DepthTarget, RenderTarget} from "../../common/framebuffer.js";
import {create} from "../../common/mat4.js";
import {Mat4, Vec3, Vec4} from "../../common/math.js";
import {Projection, ProjectionKind} from "../../common/projection.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export type Camera = CameraCanvas | CameraTarget | CameraXr;

export const enum CameraKind {
    Canvas,
    Target,
    Xr,
}

// The subset of camera data passed into render methods.
export interface CameraEye {
    View: Mat4;
    Pv: Mat4;
    Position: Vec3;
}

export interface CameraCanvas extends CameraEye {
    Kind: CameraKind.Canvas;
    Projection: Projection;
    ClearColor: Vec4;
}

export function camera_canvas_perspective(
    fovy: number,
    near: number,
    far: number,
    clear_color: Vec4 = [0.9, 0.9, 0.9, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Canvas,
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
            ClearColor: clear_color,
        };
    };
}

export function camera_canvas_ortho(
    radius: number,
    near: number,
    far: number,
    clear_color: Vec4 = [0.9, 0.9, 0.9, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Canvas,
            Projection: {
                Kind: ProjectionKind.Ortho,
                Radius: radius,
                Near: near,
                Far: far,
                Projection: create(),
                Inverse: create(),
            },
            View: create(),
            Pv: create(),
            Position: [0, 0, 0],
            ClearColor: clear_color,
        };
    };
}

export interface CameraTarget extends CameraEye {
    Kind: CameraKind.Target;
    Target: RenderTarget;
    Projection: Projection;
    ClearColor: Vec4;
}

export function camera_target_perspective(
    target: RenderTarget,
    fovy: number,
    near: number,
    far: number,
    clear_color: Vec4
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Target,
            Target: target,
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
            ClearColor: clear_color,
        };
    };
}

export function camera_target_ortho(
    target: DepthTarget,
    radius: number,
    near: number,
    far: number,
    clear_color: Vec4 = [0, 0, 0, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Target,
            Target: target,
            Projection: {
                Kind: ProjectionKind.Ortho,
                Radius: radius,
                Near: near,
                Far: far,
                Projection: create(),
                Inverse: create(),
            },
            View: create(),
            Pv: create(),
            Position: [0, 0, 0],
            ClearColor: clear_color,
        };
    };
}

export interface XrEye extends CameraEye {
    Viewpoint: XRView;
}

export interface CameraXr {
    Kind: CameraKind.Xr;
    Eyes: Array<XrEye>;
    ClearColor: Vec4;
}

export function camera_xr(clear_color: Vec4) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Xr,
            Eyes: [],
            ClearColor: clear_color,
        };
    };
}
