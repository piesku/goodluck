import {
    GL_CLAMP_TO_EDGE,
    GL_COMPARE_REF_TO_TEXTURE,
    GL_DATA_FLOAT,
    GL_DATA_UNSIGNED_BYTE,
    GL_DATA_UNSIGNED_INT,
    GL_DEPTH_COMPONENT,
    GL_DEPTH_COMPONENT24,
    GL_LINEAR,
    GL_NEAREST,
    GL_NEAREST_MIPMAP_LINEAR,
    GL_PIXEL_UNSIGNED_BYTE,
    GL_REPEAT,
    GL_RGBA,
    GL_RGBA16F,
    GL_RGBA32F,
    GL_RGBA8,
    GL_TEXTURE_2D,
    GL_TEXTURE_COMPARE_MODE,
    GL_TEXTURE_MAG_FILTER,
    GL_TEXTURE_MIN_FILTER,
    GL_TEXTURE_WRAP_S,
    GL_TEXTURE_WRAP_T,
} from "./webgl.js";

export function fetch_image(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        let image = new Image();
        image.src = path;
        image.onload = () => resolve(image);
    });
}

export function create_texture_from(gl: WebGLRenderingContext, image: HTMLImageElement) {
    let texture = gl.createTexture()!;
    gl.bindTexture(GL_TEXTURE_2D, texture);
    gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, GL_RGBA, GL_PIXEL_UNSIGNED_BYTE, image);

    gl.generateMipmap(GL_TEXTURE_2D);

    if (false) {
        // The following are the default settings in WebGL2.
        // GL_TEXTURE_MIN_FILTER: Consider switching to GL_LINEAR_MIPMAP_LINEAR for the best quality.
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST_MIPMAP_LINEAR);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    }

    return texture;
}

export interface Spritesheet {
    Texture: WebGLTexture;
    Width: number;
    Height: number;
}

export function create_spritesheet_from(
    gl: WebGLRenderingContext,
    image: HTMLImageElement,
): Spritesheet {
    let texture = gl.createTexture()!;
    gl.bindTexture(GL_TEXTURE_2D, texture);
    gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, GL_RGBA, GL_PIXEL_UNSIGNED_BYTE, image);

    // No mipmapping nor LINEAR scaling to preserve the exact pixel data.
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

    if (false) {
        // The following are the default settings in WebGL2.
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    }

    return {
        Texture: texture,
        Width: image.width,
        Height: image.height,
    };
}

export function resize_texture_rgba8(
    gl: WebGL2RenderingContext,
    texture: WebGLTexture,
    width: number,
    height: number,
) {
    gl.bindTexture(GL_TEXTURE_2D, texture);
    gl.texImage2D(
        GL_TEXTURE_2D,
        0,
        GL_RGBA8,
        width,
        height,
        0,
        GL_RGBA,
        GL_DATA_UNSIGNED_BYTE,
        null,
    );

    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    return texture;
}

/** Requires EXT_color_buffer_float. */
export function resize_texture_rgba16f(
    gl: WebGL2RenderingContext,
    texture: WebGLTexture,
    width: number,
    height: number,
) {
    gl.bindTexture(GL_TEXTURE_2D, texture);
    gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA16F, width, height, 0, GL_RGBA, GL_DATA_FLOAT, null);

    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    return texture;
}

/** Requires EXT_color_buffer_float. */
export function resize_texture_rgba32f(
    gl: WebGL2RenderingContext,
    texture: WebGLTexture,
    width: number,
    height: number,
) {
    gl.bindTexture(GL_TEXTURE_2D, texture);
    gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA32F, width, height, 0, GL_RGBA, GL_DATA_FLOAT, null);

    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

    return texture;
}

export function resize_texture_depth24(
    gl: WebGL2RenderingContext,
    texture: WebGLTexture,
    width: number,
    height: number,
) {
    gl.bindTexture(GL_TEXTURE_2D, texture);
    gl.texImage2D(
        GL_TEXTURE_2D,
        0,
        GL_DEPTH_COMPONENT24,
        width,
        height,
        0,
        GL_DEPTH_COMPONENT,
        GL_DATA_UNSIGNED_INT,
        null,
    );

    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_COMPARE_MODE, GL_COMPARE_REF_TO_TEXTURE);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    return texture;
}
