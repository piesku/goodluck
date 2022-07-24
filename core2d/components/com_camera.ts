/**
 * @module components/com_camera
 */

import {RenderTarget} from "../../common/framebuffer.js";
import {create} from "../../common/mat4.js";
import {Mat4, Vec3, Vec4} from "../../common/math.js";
import {Projection} from "../../common/projection.js";
import {GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT} from "../../common/webgl.js";
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
    FogColor: Vec4;
    FogDistance: number;
}

export interface CameraCanvas extends CameraEye {
    Kind: CameraKind.Canvas;
    Projection: Projection;
    ClearColor: Vec4;
    ClearMask: number;
}

export function camera_canvas(
    projection: Projection,
    clear_color: Vec4 = [0.9, 0.9, 0.9, 1],
    clear_mask = GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Canvas,
            Projection: projection,
            View: create(),
            Pv: create(),
            Position: [0, 0, 0],
            FogColor: clear_color,
            FogDistance: projection.Far,
            ClearColor: clear_color,
            ClearMask: clear_mask,
        };
    };
}

export interface CameraTarget extends CameraEye {
    Kind: CameraKind.Target;
    Target: RenderTarget;
    Projection: Projection;
    ClearColor: Vec4;
    ClearMask: number;
}

export function camera_target(
    target: RenderTarget,
    projection: Projection,
    clear_color: Vec4 = [0, 0, 0, 1],
    clear_mask = GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Target,
            Target: target,
            Projection: projection,
            View: create(),
            Pv: create(),
            Position: [0, 0, 0],
            FogColor: clear_color,
            FogDistance: projection.Far,
            ClearColor: clear_color,
            ClearMask: clear_mask,
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
    ClearMask: number;
}

export function camera_xr(
    clear_color: Vec4 = [0.9, 0.9, 0.9, 1],
    clear_mask = GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Xr,
            Eyes: [],
            ClearColor: clear_color,
            ClearMask: clear_mask,
        };
    };
}
