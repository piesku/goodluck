import {resize_texture_depth24, resize_texture_rgba32f, resize_texture_rgba8} from "./texture.js";
import {
    GL_COLOR_ATTACHMENT0,
    GL_COLOR_ATTACHMENT1,
    GL_COLOR_ATTACHMENT2,
    GL_COLOR_ATTACHMENT3,
    GL_DEPTH_ATTACHMENT,
    GL_FRAMEBUFFER,
    GL_FRAMEBUFFER_COMPLETE,
    GL_TEXTURE_2D,
} from "./webgl.js";

export interface ForwardTarget {
    Framebuffer: WebGLFramebuffer;
    Width: number;
    Height: number;
    RenderTexture: WebGLTexture;
    DepthTexture: WebGLTexture;
}

export function create_forward_target(gl: WebGL2RenderingContext, width: number, height: number) {
    let target: ForwardTarget = {
        Framebuffer: gl.createFramebuffer()!,
        Width: width,
        Height: height,
        RenderTexture: resize_texture_rgba8(gl, gl.createTexture()!, width, height),
        DepthTexture: resize_texture_depth24(gl, gl.createTexture()!, width, height),
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
        GL_DEPTH_ATTACHMENT,
        GL_TEXTURE_2D,
        target.DepthTexture,
        0
    );

    let status = gl.checkFramebufferStatus(GL_FRAMEBUFFER);
    if (status != GL_FRAMEBUFFER_COMPLETE) {
        throw new Error(`Failed to set up the framebuffer (${status}).`);
    }

    return target;
}

export function resize_forward_target(
    gl: WebGL2RenderingContext,
    target: ForwardTarget,
    width: number,
    height: number
) {
    target.Width = width;
    target.Height = height;

    resize_texture_rgba8(gl, target.RenderTexture, target.Width, target.Height);
    resize_texture_depth24(gl, target.DepthTexture, target.Width, target.Height);
}

export interface DeferredTarget {
    Framebuffer: WebGLFramebuffer;
    Width: number;
    Height: number;
    DiffuseTexture: WebGLTexture;
    SpecularTexture: WebGLTexture;
    PositionTexture: WebGLTexture;
    NormalTexture: WebGLTexture;
    DepthTexture: WebGLTexture;
}

/** Requires WEBGL_color_buffer_float. */
export function create_deferred_target(gl: WebGL2RenderingContext, width: number, height: number) {
    let target: DeferredTarget = {
        Framebuffer: gl.createFramebuffer()!,
        Width: width,
        Height: height,
        DiffuseTexture: resize_texture_rgba32f(gl, gl.createTexture()!, width, height),
        SpecularTexture: resize_texture_rgba32f(gl, gl.createTexture()!, width, height),
        PositionTexture: resize_texture_rgba32f(gl, gl.createTexture()!, width, height),
        NormalTexture: resize_texture_rgba32f(gl, gl.createTexture()!, width, height),
        DepthTexture: resize_texture_depth24(gl, gl.createTexture()!, width, height),
    };

    gl.bindFramebuffer(GL_FRAMEBUFFER, target.Framebuffer);
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT0,
        GL_TEXTURE_2D,
        target.DiffuseTexture,
        0
    );
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT1,
        GL_TEXTURE_2D,
        target.SpecularTexture,
        0
    );
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT2,
        GL_TEXTURE_2D,
        target.PositionTexture,
        0
    );
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT3,
        GL_TEXTURE_2D,
        target.NormalTexture,
        0
    );
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_DEPTH_ATTACHMENT,
        GL_TEXTURE_2D,
        target.DepthTexture,
        0
    );

    gl.drawBuffers([
        GL_COLOR_ATTACHMENT0,
        GL_COLOR_ATTACHMENT1,
        GL_COLOR_ATTACHMENT2,
        GL_COLOR_ATTACHMENT3,
    ]);

    let status = gl.checkFramebufferStatus(GL_FRAMEBUFFER);
    if (status != GL_FRAMEBUFFER_COMPLETE) {
        throw new Error(`Failed to set up the framebuffer (${status}).`);
    }

    return target;
}

/** Requires WEBGL_color_buffer_float. */
export function resize_deferred_target(
    gl: WebGL2RenderingContext,
    target: DeferredTarget,
    width: number,
    height: number
) {
    target.Width = width;
    target.Height = height;

    resize_texture_rgba32f(gl, target.DiffuseTexture, target.Width, target.Height);
    resize_texture_rgba32f(gl, target.SpecularTexture, target.Width, target.Height);
    resize_texture_rgba32f(gl, target.PositionTexture, target.Width, target.Height);
    resize_texture_rgba32f(gl, target.NormalTexture, target.Width, target.Height);
    resize_texture_depth24(gl, target.DepthTexture, target.Width, target.Height);
}

export interface DepthTarget {
    Framebuffer: WebGLFramebuffer;
    Width: number;
    Height: number;
    DepthTexture: WebGLTexture;
    // For the framebuffer to be complete, a color texture must be attached too,
    // even if it won't be used.
    ColorTexture: WebGLTexture;
}

export function create_depth_target(gl: WebGL2RenderingContext, width: number, height: number) {
    let target: DepthTarget = {
        Framebuffer: gl.createFramebuffer()!,
        Width: width,
        Height: height,
        ColorTexture: resize_texture_rgba8(gl, gl.createTexture()!, width, height),
        DepthTexture: resize_texture_depth24(gl, gl.createTexture()!, width, height),
    };

    gl.bindFramebuffer(GL_FRAMEBUFFER, target.Framebuffer);
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_DEPTH_ATTACHMENT,
        GL_TEXTURE_2D,
        target.DepthTexture,
        0
    );
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT0,
        GL_TEXTURE_2D,
        target.ColorTexture,
        0
    );

    let status = gl.checkFramebufferStatus(GL_FRAMEBUFFER);
    if (status != GL_FRAMEBUFFER_COMPLETE) {
        throw new Error(`Failed to set up the framebuffer (${status}).`);
    }

    return target;
}
