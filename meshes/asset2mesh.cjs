#!/usr/bin/env node

const {execFileSync} = require("child_process");
const {win32} = require("path");

// Install from https://github.com/acgessler/assimp2json.
// Requires https://github.com/assimp/assimp (v4.1.0 works fine).
const ASSIMP2JSON = "/c/Applications/assimp2json/assimp2json.exe";

let filename = process.argv[2];
if (!filename) {
    console.error("Specify a path to an asset file.");
    process.exit(1);
}

let json = execFileSync(ASSIMP2JSON, [filename], {encoding: "utf8"});
let scene = JSON.parse(json);
let {vertices, normals, faces, texturecoords} = scene.meshes[0];

let name = win32.basename(filename, ".obj");

console.log(`\
import {Mesh} from "../common/material.js";
import {GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_STATIC_DRAW} from "../common/webgl.js";

export function mesh_${name}(gl: WebGLRenderingContext): Mesh {
    let Vertices = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, Vertices);
    gl.bufferData(GL_ARRAY_BUFFER, vertices, GL_STATIC_DRAW);
    let Normals = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, Normals);
    gl.bufferData(GL_ARRAY_BUFFER, normals, GL_STATIC_DRAW);
    let TexCoords = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, TexCoords);
    gl.bufferData(GL_ARRAY_BUFFER, texcoords, GL_STATIC_DRAW);
    let Indices = gl.createBuffer()!;
    gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, Indices);
    gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, indices, GL_STATIC_DRAW);
    return {
        Vertices,
        Normals,
        TexCoords,
        Indices,
        Count: indices.length,
    };
}

let vertices = Float32Array.from([
    ${vertices.join(",\n    ")},
]);

let normals = Float32Array.from([
    ${normals.join(",\n    ")},
]);

let texcoords = Float32Array.from([
    ${texturecoords[0].join(",\n    ")},
]);

let indices = Uint16Array.from([
    ${faces
        // Flatten faces into one big index array.
        .flat(1)
        // Both Blender and Assimp triangulate polygons starting from the first
        // vertex and going CCW tri-by-tri. The result is that adjacent tris
        // share their first vertex rather than the last which breaks flat
        // shading. In OpenGL, the provoking vertex of a primitive is by
        // default set to the last one. WebGL doesn't expose the
        // glProvokingVertex API to change the default. By reversing the index
        // array, the tri get drawn in reverse order and the shared vertices
        // become last.
        .reverse()
        .join(",\n    ")},
]);`);
