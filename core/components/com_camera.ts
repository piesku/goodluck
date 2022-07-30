/**
 * @module components/com_camera
 */

import {RenderTarget} from "../../common/framebuffer.js";
import {create} from "../../common/mat4.js";
import {Mat4, Vec2, Vec3, Vec4} from "../../common/math.js";
import {Projection} from "../../common/projection.js";
import {transform_position} from "../../common/vec3.js";
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
    Pv: Mat4;
    Position: Vec3;
    FogColor: Vec4;
    FogDistance: number;
}

export interface CameraCanvas extends CameraEye {
    Kind: CameraKind.Canvas;
    Projection: Projection;
    World: Mat4;
    ViewportWidth: number;
    ViewportHeight: number;
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
            World: create(),
            ViewportWidth: 0,
            ViewportHeight: 0,
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
    World: Mat4;
    ViewportWidth: number;
    ViewportHeight: number;
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
            World: create(),
            ViewportWidth: 0,
            ViewportHeight: 0,
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
    World: Mat4;
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
            World: create(),
            ClearColor: clear_color,
            ClearMask: clear_mask,
        };
    };
}

// Utilities.

export function viewport_to_world(out: Vec3, camera: CameraCanvas | CameraTarget, pos: Vec2) {
    // Transform the position from viewport space to the NDC space (where +Y is up).
    out[0] = (pos[0] / camera.ViewportWidth) * 2 - 1;
    out[1] = -(pos[1] / camera.ViewportHeight) * 2 + 1;
    // Assume pos is on the far plane.
    out[2] = 1;

    // ...then to the eye space...
    transform_position(out, out, camera.Projection.Inverse);

    // ...and then to the world space.
    transform_position(out, out, camera.World);
}
