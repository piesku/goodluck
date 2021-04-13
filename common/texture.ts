import {
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
    GL_RGBA32F,
    GL_RGBA8,
    GL_TEXTURE_2D,
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

    // WebGL1 can only mipmap images which are a power of 2 in both dimensions.
    // When targeting WebGL2 only, this if guard can be removed.
    if (is_power_of_2(image.width) && is_power_of_2(image.height)) {
        gl.generateMipmap(GL_TEXTURE_2D);
        // GL_NEAREST_MIPMAP_LINEAR is the default. Consider switching to
        // GL_LINEAR_MIPMAP_LINEAR for the best quality.
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST_MIPMAP_LINEAR);
        // GL_LINEAR is the default; make it explicit.
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    } else {
        // GL_LINEAR is the default; make it explicit.
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    }

    // GL_REPEAT is the default; make it explicit.
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

    return texture;
}

// In WebGL1, the internal format must be the same as the data format (GL_RGBA).
export function resize_texture_rgba(
    gl: WebGLRenderingContext,
    texture: WebGLTexture,
    width: number,
    height: number
) {
    gl.bindTexture(GL_TEXTURE_2D, texture);
    gl.texImage2D(
        GL_TEXTURE_2D,
        0,
        GL_RGBA,
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

export function resize_texture_rgba8(
    gl: WebGLRenderingContext,
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

export function resize_texture_rgba32f(
    gl: WebGLRenderingContext,
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

export function create_render_buffer(gl: WebGLRenderingContext, width: number, height: number) {
    let buffer = gl.createRenderbuffer()!;
    gl.bindRenderbuffer(gl.RENDERBUFFER, buffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    return buffer;
}

// Depth textures are a WebGL2 feature. They can also be used in WebGL1 via an extension:
// https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_draw_buffers
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

    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

    return texture;
}

function is_power_of_2(value: number) {
    return (value & (value - 1)) == 0;
}
