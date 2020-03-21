import {Mesh} from "../common/material.js";
import {GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_STATIC_DRAW} from "../common/webgl.js";

export function mesh_plane(gl: WebGLRenderingContext): Mesh {
    let Vertices = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, Vertices);
    gl.bufferData(GL_ARRAY_BUFFER, vertices, GL_STATIC_DRAW);
    let Normals = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, Normals);
    gl.bufferData(GL_ARRAY_BUFFER, normals, GL_STATIC_DRAW);
    let TextureCoords = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, TextureCoords);
    gl.bufferData(GL_ARRAY_BUFFER, uvs, GL_STATIC_DRAW);
    let Indices = gl.createBuffer()!;
    gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, Indices);
    gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, indices, GL_STATIC_DRAW);
    return {
        Vertices,
        Normals,
        TextureCoords,
        Indices,
        Count: indices.length,
    };
}

let vertices = Float32Array.from([-1, 0, 1, 1, 0, 1, 1, 0, -1, -1, 0, -1]);

let normals = Float32Array.from([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);

let uvs = Float32Array.from([1, 1, 0, 1, 0, 0, 1, 0]);

let indices = Uint16Array.from([3, 2, 0, 2, 1, 0]);
