import {DepthTarget, Forward1Target} from "../../common/framebuffer.js";
import {create} from "../../common/mat4.js";
import {Mat4, Vec3, Vec4} from "../../common/math.js";
import {Projection, ProjectionKind} from "../../common/projection.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

interface Game1 extends Game {
    Gl: WebGLRenderingContext;
}

export type Camera = CameraDisplay | CameraFramebuffer | CameraDepth;

export const enum CameraKind {
    Display,
    Framebuffer,
    Depth,
}

// The subset of camera data passed into shaders.
export interface CameraEye {
    View: Mat4;
    Pv: Mat4;
    Position: Vec3;
}

export interface CameraDisplay extends CameraEye {
    Kind: CameraKind.Display;
    Projection: Projection;
    ClearColor: Vec4;
}

export function camera_display_perspective(
    fovy: number,
    near: number,
    far: number,
    clear_color: Vec4 = [0.9, 0.9, 0.9, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Display,
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
    Target: Forward1Target;
    Projection: Projection;
    ClearColor: Vec4;
}

export function camera_framebuffer_perspective(
    fovy: number,
    near: number,
    far: number,
    target: Forward1Target,
    clear_color: Vec4
) {
    return (game: Game1, entity: Entity) => {
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

export interface CameraDepth extends CameraEye {
    Kind: CameraKind.Depth;
    Target: DepthTarget;
    Projection: Projection;
    ClearColor: Vec4;
}

export function camera_depth_ortho(
    radius: number,
    near: number,
    far: number,
    target: DepthTarget,
    clear_color: Vec4
) {
    return (game: Game1, entity: Entity) => {
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
