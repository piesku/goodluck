import {
    create_texture_depth,
    create_texture_rgba,
    resize_texture_depth,
    resize_texture_rgba,
} from "./texture.js";
import {
    GL_COLOR_ATTACHMENT0,
    GL_COLOR_ATTACHMENT1,
    GL_DEPTH_ATTACHMENT,
    GL_FRAMEBUFFER,
    GL_FRAMEBUFFER_COMPLETE,
    GL_TEXTURE_2D,
} from "./webgl.js";

export interface RenderTarget {
    Framebuffer: WebGLFramebuffer;
    Width: number;
    Height: number;
    RenderTexture: WebGLTexture;
    NormalsTexture: WebGLTexture;
    DepthTexture: WebGLTexture;
}

export function create_render_target(gl: WebGL2RenderingContext, width: number, height: number) {
    let target = {
        Framebuffer: gl.createFramebuffer()!,
        Width: width,
        Height: height,
        RenderTexture: create_texture_rgba(gl, width, height),
        NormalsTexture: create_texture_rgba(gl, width, height),
        DepthTexture: create_texture_depth(gl, width, height),
    };

    gl.bindFramebuffer(GL_FRAMEBUFFER, target.Framebuffer);
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT0,
        GL_TEXTURE_2D,
        target.RenderTexture,
        0
    );
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT1,
        GL_TEXTURE_2D,
        target.NormalsTexture,
        0
    );
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_DEPTH_ATTACHMENT,
        GL_TEXTURE_2D,
        target.DepthTexture,
        0
    );

    gl.drawBuffers([GL_COLOR_ATTACHMENT0, GL_COLOR_ATTACHMENT1]);

    if (gl.checkFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE) {
        throw new Error("Failed to set up the framebuffer.");
    }

    return target;
}

export function resize_render_target(
    gl: WebGL2RenderingContext,
    target: RenderTarget,
    width: number,
    height: number
) {
    target.Width = width;
    target.Height = height;

    resize_texture_rgba(gl, target.RenderTexture, target.Width, target.Height);
    resize_texture_rgba(gl, target.NormalsTexture, target.Width, target.Height);
    resize_texture_depth(gl, target.DepthTexture, target.Width, target.Height);
}
