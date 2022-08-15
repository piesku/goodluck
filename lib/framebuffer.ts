import {Output} from "../materials/layout.js";
import {
    resize_texture_depth24,
    resize_texture_rgba16f,
    resize_texture_rgba32f,
    resize_texture_rgba8,
} from "./texture.js";
import {
    GL_COLOR_ATTACHMENT0,
    GL_DEPTH_ATTACHMENT,
    GL_FRAMEBUFFER,
    GL_FRAMEBUFFER_COMPLETE,
    GL_TEXTURE_2D,
} from "./webgl.js";

export type RenderTarget = ForwardTarget | HdrTarget | DeferredTarget | DepthTarget;

export const enum TargetKind {
    Forward,
    Hdr,
    Deferred,
    Depth,
}

export interface ForwardTarget {
    Kind: TargetKind.Forward;
    Framebuffer: WebGLFramebuffer;
    Width: number;
    Height: number;
    ResizeToViewport: boolean;
    ColorTexture: WebGLTexture;
    DepthTexture: WebGLTexture;
}

export function create_forward_target(
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    resize_to_viewport: boolean
) {
    let target: ForwardTarget = {
        Kind: TargetKind.Forward,
        Framebuffer: gl.createFramebuffer()!,
        Width: width,
        Height: height,
        ResizeToViewport: resize_to_viewport,
        ColorTexture: resize_texture_rgba8(gl, gl.createTexture()!, width, height),
        DepthTexture: resize_texture_depth24(gl, gl.createTexture()!, width, height),
    };

    gl.bindFramebuffer(GL_FRAMEBUFFER, target.Framebuffer);
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT0,
        GL_TEXTURE_2D,
        target.ColorTexture,
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

    resize_texture_rgba8(gl, target.ColorTexture, target.Width, target.Height);
    resize_texture_depth24(gl, target.DepthTexture, target.Width, target.Height);
}

export interface HdrTarget {
    Kind: TargetKind.Hdr;
    Framebuffer: WebGLFramebuffer;
    Width: number;
    Height: number;
    ResizeToViewport: boolean;
    ColorTexture: WebGLTexture;
    DepthTexture: WebGLTexture;
}

export function create_hdr_target(
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    resize_to_viewport: boolean
) {
    let target: HdrTarget = {
        Kind: TargetKind.Hdr,
        Framebuffer: gl.createFramebuffer()!,
        Width: width,
        Height: height,
        ResizeToViewport: resize_to_viewport,
        ColorTexture: resize_texture_rgba16f(gl, gl.createTexture()!, width, height),
        DepthTexture: resize_texture_depth24(gl, gl.createTexture()!, width, height),
    };

    gl.bindFramebuffer(GL_FRAMEBUFFER, target.Framebuffer);
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT0,
        GL_TEXTURE_2D,
        target.ColorTexture,
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

export function resize_hdr_target(
    gl: WebGL2RenderingContext,
    target: HdrTarget,
    width: number,
    height: number
) {
    target.Width = width;
    target.Height = height;

    resize_texture_rgba16f(gl, target.ColorTexture, target.Width, target.Height);
    resize_texture_depth24(gl, target.DepthTexture, target.Width, target.Height);
}

export interface DeferredTarget {
    Kind: TargetKind.Deferred;
    Framebuffer: WebGLFramebuffer;
    Width: number;
    Height: number;
    ResizeToViewport: boolean;
    DiffuseTexture: WebGLTexture;
    SpecularTexture: WebGLTexture;
    PositionTexture: WebGLTexture;
    NormalTexture: WebGLTexture;
    DepthTexture: WebGLTexture;
}

/** Requires WEBGL_color_buffer_float. */
export function create_deferred_target(
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    resize_to_viewport: boolean
) {
    let target: DeferredTarget = {
        Kind: TargetKind.Deferred,
        Framebuffer: gl.createFramebuffer()!,
        Width: width,
        Height: height,
        ResizeToViewport: resize_to_viewport,
        DiffuseTexture: resize_texture_rgba32f(gl, gl.createTexture()!, width, height),
        SpecularTexture: resize_texture_rgba32f(gl, gl.createTexture()!, width, height),
        PositionTexture: resize_texture_rgba32f(gl, gl.createTexture()!, width, height),
        NormalTexture: resize_texture_rgba32f(gl, gl.createTexture()!, width, height),
        DepthTexture: resize_texture_depth24(gl, gl.createTexture()!, width, height),
    };

    gl.bindFramebuffer(GL_FRAMEBUFFER, target.Framebuffer);
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT0 + Output.Diffuse,
        GL_TEXTURE_2D,
        target.DiffuseTexture,
        0
    );
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT0 + Output.Specular,
        GL_TEXTURE_2D,
        target.SpecularTexture,
        0
    );
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT0 + Output.Position,
        GL_TEXTURE_2D,
        target.PositionTexture,
        0
    );
    gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT0 + Output.Normal,
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

    // MAX_DRAW_BUFFERS is 4 on Safari 15.
    gl.drawBuffers([
        GL_COLOR_ATTACHMENT0 + Output.Diffuse,
        GL_COLOR_ATTACHMENT0 + Output.Specular,
        GL_COLOR_ATTACHMENT0 + Output.Position,
        GL_COLOR_ATTACHMENT0 + Output.Normal,
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
    Kind: TargetKind.Depth;
    Framebuffer: WebGLFramebuffer;
    Width: number;
    Height: number;
    ResizeToViewport: false;
    DepthTexture: WebGLTexture;
    // For the framebuffer to be complete, a color texture must be attached too,
    // even if it won't be used.
    ColorTexture: WebGLTexture;
}

export function create_depth_target(gl: WebGL2RenderingContext, width: number, height: number) {
    let target: DepthTarget = {
        Kind: TargetKind.Depth,
        Framebuffer: gl.createFramebuffer()!,
        Width: width,
        Height: height,
        ResizeToViewport: false,
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
