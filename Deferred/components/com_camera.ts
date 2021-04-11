import {create, perspective} from "../../common/mat4.js";
import {Mat4, Vec4} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export type Camera = CameraDisplay | CameraFramebuffer;
export const enum CameraKind {
    Display,
    Framebuffer,
}

export interface RenderTarget {
    Framebuffer: WebGLFramebuffer;
    Width: number;
    Height: number;
    RenderTexture: WebGLTexture;
    NormalsTexture: WebGLTexture;
    DepthTexture: WebGLTexture;
}

export interface CameraEye {
    World: Mat4;
    View: Mat4;
    Pv: Mat4;
    Unprojection: Mat4;
}

export interface CameraDisplay extends CameraEye {
    Kind: CameraKind.Display;
    FovY: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    ClearColor: Vec4;
}
export function camera_display_perspective(
    fovy: number,
    near: number,
    far: number,
    clear_color: Vec4
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Display,
            FovY: fovy,
            Near: near,
            Far: far,
            World: create(),
            View: create(),
            Projection: create(),
            Unprojection: create(),
            Pv: create(),
            ClearColor: clear_color,
        };
    };
}

export interface CameraFramebuffer extends CameraEye {
    Kind: CameraKind.Framebuffer;
    Target: RenderTarget;
    FovY: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    Unprojection: Mat4;
    ClearColor: Vec4;
}
export function camera_framebuffer_perspective(
    target: RenderTarget,
    fovy: number,
    near: number,
    far: number,
    clear_color: Vec4
) {
    return (game: Game, entity: Entity) => {
        let projection = create();
        perspective(projection, fovy, 1, near, far);

        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Framebuffer,
            Target: target,
            FovY: fovy,
            Near: near,
            Far: far,
            World: create(),
            View: create(),
            Projection: projection,
            Unprojection: create(),
            Pv: create(),
            ClearColor: clear_color,
        };
    };
}
