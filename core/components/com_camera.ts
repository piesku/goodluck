import {create, perspective} from "../../common/mat4.js";
import {Mat4, Vec3, Vec4} from "../../common/math.js";
import {
    GL_COLOR_ATTACHMENT0,
    GL_DEPTH_ATTACHMENT,
    GL_FRAMEBUFFER,
    GL_RENDERBUFFER,
    GL_TEXTURE_2D,
} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export type Camera = CameraDisplay | CameraFramebuffer;
export const enum CameraKind {
    Display,
    Framebuffer,
}

export interface CameraEye {
    Pv: Mat4;
    Position: Vec3;
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
    clear_color: Vec4 = [0.9, 0.9, 0.9, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Display,
            FovY: fovy,
            Near: near,
            Far: far,
            Projection: create(),
            Pv: create(),
            Position: [0, 0, 0],
            ClearColor: clear_color,
        };
    };
}

interface GameGl extends Game {
    Gl: WebGLRenderingContext;
}

export interface CameraFramebuffer extends CameraEye {
    Kind: CameraKind.Framebuffer;
    Target: WebGLFramebuffer;
    RenderTexture: WebGLTexture;
    DepthBuffer: WebGLRenderbuffer;
    ViewportWidth: number;
    ViewportHeight: number;
    FovY: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    ClearColor: Vec4;
}

export function camera_framebuffer_perspective(
    fovy: number,
    near: number,
    far: number,
    render_texture: WebGLTexture,
    depth_buffer: WebGLRenderbuffer,
    width: number,
    height: number,
    clear_color: Vec4
) {
    return (game: GameGl, entity: Entity) => {
        let projection = create();
        perspective(projection, fovy, 1, near, far);
        let target = game.Gl.createFramebuffer()!;
        game.Gl.bindFramebuffer(GL_FRAMEBUFFER, target);
        game.Gl.framebufferTexture2D(
            GL_FRAMEBUFFER,
            GL_COLOR_ATTACHMENT0,
            GL_TEXTURE_2D,
            render_texture,
            0
        );
        game.Gl.framebufferRenderbuffer(
            GL_FRAMEBUFFER,
            GL_DEPTH_ATTACHMENT,
            GL_RENDERBUFFER,
            depth_buffer
        );
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Framebuffer,
            Target: target,
            RenderTexture: render_texture,
            DepthBuffer: depth_buffer,
            ViewportWidth: width,
            ViewportHeight: height,
            FovY: fovy,
            Near: near,
            Far: far,
            Projection: projection,
            Pv: create(),
            Position: [0, 0, 0],
            ClearColor: clear_color,
        };
    };
}
