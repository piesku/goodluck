#!/usr/bin/env node

const {execFileSync} = require("child_process");

// Install from https://github.com/acgessler/assimp2json.
// Requires https://github.com/assimp/assimp (v4.1.0 works fine).
const ASSIMP2JSON = "/c/Applications/assimp2json/assimp2json.exe";

let filename = process.argv[2];
if (!filename) {
    console.error("Specify a path to an asset file.")
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
    ${faces.reduce((acc, cur) => acc.concat(cur)).join(", ")}
]);

export
let normals = Float32Array.from([
    ${normals.join(", ")}
]);`);
