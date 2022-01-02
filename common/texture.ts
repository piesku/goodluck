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

    // GL_NEAREST_MIPMAP_LINEAR is the default. Consider switching to
    // GL_LINEAR_MIPMAP_LINEAR for the best quality.
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST_MIPMAP_LINEAR);
    // GL_LINEAR is the default; make it explicit.
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    // GL_REPEAT is the default; make it explicit.
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

    return texture;
}

export function resize_texture_rgba8(
    gl: WebGL2RenderingContext,
    texture: WebGLTexture,
    width: number,
    height: number
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
        null
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
    height: number
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
    height: number
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
    height: number
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
        null
    );

    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_COMPARE_MODE, GL_COMPARE_REF_TO_TEXTURE);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    return texture;
}
