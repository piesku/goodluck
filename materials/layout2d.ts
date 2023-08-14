import {GL_ARRAY_BUFFER, GL_FLOAT, GL_STATIC_DRAW} from "../lib/webgl.js";

export const enum Attribute {
    VertexPosition,
    VertexTexCoord,
    InstanceRotation,
    InstanceTranslation,
    InstanceColor,
    InstanceSprite,
}

export interface Render2DLayout {
    // Uniforms
    Pv: WebGLUniformLocation;
    World: WebGLUniformLocation;
    SheetTexture: WebGLUniformLocation;
    SheetSize: WebGLUniformLocation;
}

export const FLOATS_PER_INSTANCE = 16;
const BYTES_PER_INSTANCE = FLOATS_PER_INSTANCE * 4;

export function setup_render2d_buffers(gl: WebGL2RenderingContext, instance_buffer: WebGLBuffer) {
    // A quad for rendering 2D sprites. Texcoords are +Y=down for compatibility
    // with spritesheet map coordinates.
    // prettier-ignore
    let vertex_arr = Float32Array.from([
        -0.51, -0.51,    0, 1,    // SW
        0.51, -0.51,     1, 1,    // SE
        -0.51, 0.51,     0, 0,    // NW
        0.51, 0.51,      1, 0     // NE
    ]);

    // Vertex positions and texture coordinates.
    gl.bindBuffer(GL_ARRAY_BUFFER, gl.createBuffer()!);
    gl.bufferData(GL_ARRAY_BUFFER, vertex_arr, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(Attribute.VertexPosition);
    gl.vertexAttribPointer(Attribute.VertexPosition, 2, GL_FLOAT, false, 4 * 4, 0);
    gl.enableVertexAttribArray(Attribute.VertexTexCoord);
    gl.vertexAttribPointer(Attribute.VertexTexCoord, 2, GL_FLOAT, false, 4 * 4, 4 * 2);

    // Instance data.
    gl.bindBuffer(GL_ARRAY_BUFFER, instance_buffer);
    gl.enableVertexAttribArray(Attribute.InstanceRotation);
    gl.vertexAttribDivisor(Attribute.InstanceRotation, 1);
    gl.vertexAttribPointer(Attribute.InstanceRotation, 4, GL_FLOAT, false, BYTES_PER_INSTANCE, 0);

    gl.enableVertexAttribArray(Attribute.InstanceTranslation);
    gl.vertexAttribDivisor(Attribute.InstanceTranslation, 1);
    gl.vertexAttribPointer(
        Attribute.InstanceTranslation,
        4,
        GL_FLOAT,
        false,
        BYTES_PER_INSTANCE,
        4 * 4,
    );

    gl.enableVertexAttribArray(Attribute.InstanceColor);
    gl.vertexAttribDivisor(Attribute.InstanceColor, 1);
    gl.vertexAttribPointer(Attribute.InstanceColor, 4, GL_FLOAT, false, BYTES_PER_INSTANCE, 4 * 8);

    gl.enableVertexAttribArray(Attribute.InstanceSprite);
    gl.vertexAttribDivisor(Attribute.InstanceSprite, 1);
    gl.vertexAttribPointer(
        Attribute.InstanceSprite,
        4,
        GL_FLOAT,
        false,
        BYTES_PER_INSTANCE,
        4 * 12,
    );
}
