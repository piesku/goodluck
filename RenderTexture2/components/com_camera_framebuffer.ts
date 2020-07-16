import {create, perspective} from "../../common/mat4.js";
import {Mat4, Vec4} from "../../common/math.js";
import {
    GL_COLOR_ATTACHMENT0,
    GL_DEPTH_ATTACHMENT,
    GL_FRAMEBUFFER,
    GL_TEXTURE_2D,
} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";
import {CameraKind} from "./com_camera.js";

export interface CameraFramebuffer {
    Kind: CameraKind.Framebuffer;
    Target: WebGLFramebuffer;
    RenderTexture: WebGLTexture;
    DepthTexture: WebGLTexture;
    ViewportWidth: number;
    ViewportHeight: number;
    FovY: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    Pv: Mat4;
    ClearColor: Vec4;
}
export function camera_framebuffer(
    fovy: number,
    near: number,
    far: number,
    render_texture: WebGLTexture,
    depth_texture: WebGLTexture,
    width: number,
    height: number,
    clear_color: Vec4
) {
    return (game: Game, entity: Entity) => {
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
        game.Gl.framebufferTexture2D(
            GL_FRAMEBUFFER,
            GL_DEPTH_ATTACHMENT,
            GL_TEXTURE_2D,
            depth_texture,
            0
        );
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Framebuffer,
            Target: target,
            RenderTexture: render_texture,
            DepthTexture: depth_texture,
            ViewportWidth: width,
            ViewportHeight: height,
            FovY: fovy,
            Near: near,
            Far: far,
            Projection: projection,
            Pv: create(),
            ClearColor: clear_color,
        };
    };
}
