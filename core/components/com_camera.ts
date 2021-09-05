/**
 * @module components/com_camera
 */

import {DeferredTarget, DepthTarget, ForwardTarget} from "../../common/framebuffer.js";
import {create} from "../../common/mat4.js";
import {Mat4, Vec3, Vec4} from "../../common/math.js";
import {Projection, ProjectionKind} from "../../common/projection.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export type Camera = CameraForward | CameraDeferred | CameraFramebuffer | CameraDepth;

export const enum CameraKind {
    Forward,
    Deferred,
    Framebuffer,
    Depth,
}

// The subset of camera data passed into render methods.
export interface CameraEye {
    View: Mat4;
    Pv: Mat4;
    Position: Vec3;
}

export interface CameraForward extends CameraEye {
    Kind: CameraKind.Forward;
    Projection: Projection;
    ClearColor: Vec4;
}

export function camera_forward_perspective(
    fovy: number,
    near: number,
    far: number,
    clear_color: Vec4 = [0.9, 0.9, 0.9, 1]
) {
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
            ClearColor: clear_color,
        };
    };
}

export interface CameraFramebuffer extends CameraEye {
    Kind: CameraKind.Framebuffer;
    Target: ForwardTarget;
    Projection: Projection;
    ClearColor: Vec4;
}

export function camera_framebuffer_perspective(
    target: ForwardTarget,
    fovy: number,
    near: number,
    far: number,
    clear_color: Vec4
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Framebuffer,
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

export interface CameraDeferred extends CameraEye {
    Kind: CameraKind.Deferred;
    Target: DeferredTarget;
    Projection: Projection;
    ClearColor: Vec4;
}

export function camera_deferred_perspective(
    target: DeferredTarget,
    fovy: number,
    near: number,
    far: number,
    clear_color: Vec4
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Deferred,
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

export interface CameraDepth extends CameraEye {
    Kind: CameraKind.Depth;
    Target: DepthTarget;
    Projection: Projection;
    ClearColor: Vec4;
}

export function camera_depth_perspective(
    target: DepthTarget,
    fovy: number,
    near: number,
    far: number,
    clear_color: Vec4 = [0, 0, 0, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Depth,
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

export function camera_depth_ortho(
    target: DepthTarget,
    radius: number,
    near: number,
    far: number,
    clear_color: Vec4 = [0, 0, 0, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Depth,
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
