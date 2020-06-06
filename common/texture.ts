import {
    GL_CLAMP_TO_EDGE,
    GL_DATA_UNSIGNED_BYTE,
    GL_DATA_UNSIGNED_INT,
    GL_DEPTH_COMPONENT,
    GL_DEPTH_COMPONENT16,
    GL_LINEAR,
    GL_PIXEL_UNSIGNED_BYTE,
    GL_RGBA,
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
    gl.generateMipmap(GL_TEXTURE_2D);

    // WebGL1 can only mipmap images which are a power of 2 in both dimensions.
    if (is_power_of_2(image.width) && is_power_of_2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    }

    return texture;
}

export function create_texture_rgba(gl: WebGLRenderingContext, width: number, height: number) {
    let texture = gl.createTexture()!;
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
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

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
export function create_texture_depth(gl: WebGL2RenderingContext, width: number, height: number) {
    let texture = gl.createTexture()!;
    gl.bindTexture(GL_TEXTURE_2D, texture);
    gl.texImage2D(
        GL_TEXTURE_2D,
        0,
        GL_DEPTH_COMPONENT16,
        width,
        height,
        0,
        GL_DEPTH_COMPONENT,
        GL_DATA_UNSIGNED_INT,
        null
    );

    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    return texture;
}

function is_power_of_2(value: number) {
    return (value & (value - 1)) == 0;
}
