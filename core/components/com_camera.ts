/**
 * # Camera
 *
 * The `Camera` component makes the rendering system render the scene from the
 * vantage point of the entity.
 *
 * In WebGL, similar to OpenGL, cameras see backwards!
 */

import {RenderTarget} from "../../lib/framebuffer.js";
import {mat4_create} from "../../lib/mat4.js";
import {Mat4, Vec2, Vec3, Vec4} from "../../lib/math.js";
import {Projection} from "../../lib/projection.js";
import {vec3_transform_position} from "../../lib/vec3.js";
import {GL_COLOR_BUFFER_BIT, GL_DEPTH_BUFFER_BIT} from "../../lib/webgl.js";
import {Entity} from "../../lib/world.js";
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

/**
 * Add `CameraCanvas` to an entity.
 *
 * `CameraCanvas` is a camera that renders directly to the canvas.
 *
 * @param projection The projection to use.
 * @param clear_color Color to use when clearing the color buffer.
 * @param clear_mask Which buffers to clear?
 */
export function camera_canvas(
    projection: Projection,
    clear_color: Vec4 = [0.9, 0.9, 0.9, 1],
    clear_mask = GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT,
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Canvas,
            Projection: projection,
            World: mat4_create(),
            ViewportWidth: 0,
            ViewportHeight: 0,
            Pv: mat4_create(),
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

/**
 * Add `CameraTarget` to an entity.
 *
 * `CameraTarget` is a camera that renders to a [render target](lib_framebuffer.html).
 *
 * @param target The render target to render into.
 * @param projection The projection to use.
 * @param clear_color Color to use when clearing the color buffer.
 * @param clear_mask Which buffers to clear?
 */
export function camera_target(
    target: RenderTarget,
    projection: Projection,
    clear_color: Vec4 = [0, 0, 0, 1],
    clear_mask = GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT,
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Target,
            Target: target,
            Projection: projection,
            World: mat4_create(),
            ViewportWidth: 0,
            ViewportHeight: 0,
            Pv: mat4_create(),
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

/**
 * Add `CameraXR` to an entity.
 *
 * `CameraXR` is a camera that renders to WebXR framebuffers. It always uses a
 * perspective projection, defined through the WebXR API.
 *
 * @param clear_color Color to use when clearing the color buffer.
 * @param clear_mask Which buffers to clear?
 */
export function camera_xr(
    clear_color: Vec4 = [0.9, 0.9, 0.9, 1],
    clear_mask = GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT,
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Xr,
            Eyes: [],
            World: mat4_create(),
            ClearColor: clear_color,
            ClearMask: clear_mask,
        };
    };
}

// Utilities.

/**
 * Transform a point on the screen (in pixel coords) into a point in the world's
 * 3D space (in world units).
 *
 * @param out The world-space position to write to.
 * @param camera The camera whose projection to unapply.
 * @param pos  The screen-space position to transform.
 */
export function viewport_to_world(out: Vec3, camera: CameraCanvas | CameraTarget, pos: Vec2) {
    // Transform the position from viewport space to the NDC space (where +Y is up).
    out[0] = (pos[0] / camera.ViewportWidth) * 2 - 1;
    out[1] = -(pos[1] / camera.ViewportHeight) * 2 + 1;
    // Assume pos is on the far plane.
    out[2] = 1;

    // ...then to the eye space...
    vec3_transform_position(out, out, camera.Projection.Inverse);

    // ...and then to the world space.
    vec3_transform_position(out, out, camera.World);
}
