#!/usr/bin/env node

const {execFileSync} = require("child_process");

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
let {vertices, normals, faces} = scene.meshes[0];

console.log(`\
export
let vertices = Float32Array.from([
    ${vertices.join(", ")}
]);

export
let indices = Uint16Array.from([
    ${faces
        // Flatten faces into one big index array.
        .reduce((acc, cur) => acc.concat(cur))
        // Both Blender and Assimp triangulate polygons starting from the first
        // vertex and going CCW tri-by-tri. The result is that adjacent tris
        // share their first vertex rather than the last which breaks flat
        // shading. In OpenGL, the provoking vertex of a primitive is by
        // default set to the last one. WebGL doesn't expose the
        // glProvokingVertex API to change the default. By reversing the index
        // array, the tri get drawn in reverse order and the shared vertices
        // become last.
        .reverse()
        .join(", ")}
]);

export
let normals = Float32Array.from([
    ${normals.join(", ")}
]);`);
