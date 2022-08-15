#!/usr/bin/env node

const {readFileSync} = require("fs");

if (process.argv.length !== 3) {
    console.error("Provide a GLTF file on stdin and the name of the mesh:");
    console.error("  cat foo.gltf | node gltf2mesh.cjs foo");
    process.exit(1);
}

const PRECISION = 6;
process.stdin.resume();
let json = readFileSync(process.stdin.fd, "utf8");
process.stdin.pause();

function break_every(count, elements, decimals = 0) {
    if (elements.length === 0) {
        return "";
    }

    let output = "\n    " + elements[0].toFixed(decimals);
    for (let i = 1; i < elements.length; i++) {
        let elem = elements[i].toFixed(decimals);
        if (i % count > 0) {
            output += ", " + elem;
        } else {
            output += ",\n    " + elem;
        }
    }
    return output + "\n";
}

function data_uri_to_buffer(uri) {
    let data = uri.split(",")[1];
    let buf = Buffer.from(data, "base64");
    return buf;
}

let gltf = JSON.parse(json);
let buffer = data_uri_to_buffer(gltf.buffers[0].uri);

let mesh = gltf.meshes[0];
let primitive = mesh.primitives[0];

let position_accessor = gltf.accessors[primitive.attributes.POSITION];
let position_view = gltf.bufferViews[position_accessor.bufferView];
let position_data = new Float32Array(
    buffer.buffer,
    buffer.byteOffset + position_view.byteOffset,
    position_view.byteLength / 4
);

let vertex_count = position_data.length / 3;

let normal_accessor = gltf.accessors[primitive.attributes.NORMAL];
let normal_view = gltf.bufferViews[normal_accessor.bufferView];
let normal_data = new Float32Array(
    buffer.buffer,
    buffer.byteOffset + normal_view.byteOffset,
    normal_view.byteLength / 4
);

let texcoord_data;
if (primitive.attributes.TEXCOORD_0) {
    let texcoord_accessor = gltf.accessors[primitive.attributes.TEXCOORD_0];
    let texcoord_view = gltf.bufferViews[texcoord_accessor.bufferView];
    texcoord_data = new Float32Array(
        buffer.buffer,
        buffer.byteOffset + texcoord_view.byteOffset,
        texcoord_view.byteLength / 4
    );
} else {
    texcoord_data = new Float32Array();
}

let joints_data;
if (primitive.attributes.JOINTS_0) {
    let joints_accessor = gltf.accessors[primitive.attributes.JOINTS_0];
    let joints_view = gltf.bufferViews[joints_accessor.bufferView];
    joints_data = new Uint8Array(
        buffer.buffer,
        buffer.byteOffset + joints_view.byteOffset,
        joints_view.byteLength
    );
} else {
    joints_data = new Uint8Array();
}

let weights_data;
if (primitive.attributes.WEIGHTS_0) {
    let weights_accessor = gltf.accessors[primitive.attributes.WEIGHTS_0];
    let weights_view = gltf.bufferViews[weights_accessor.bufferView];
    weights_data = new Float32Array(
        buffer.buffer,
        buffer.byteOffset + weights_view.byteOffset,
        weights_view.byteLength / 4
    );
} else {
    weights_data = new Float32Array();
}

let index_accessor = gltf.accessors[primitive.indices];
let index_view = gltf.bufferViews[index_accessor.bufferView];
let index_data = new Uint16Array(
    buffer.buffer,
    buffer.byteOffset + index_view.byteOffset,
    index_view.byteLength / 2
);

let weighted_joints = [];
if (joints_data.length > 0 && weights_data.length > 0) {
    for (let i = 0; i < vertex_count; i++) {
        weighted_joints.push(
            joints_data[4 * i + 0],
            weights_data[4 * i + 0],
            joints_data[4 * i + 1],
            weights_data[4 * i + 1]
        );
    }
}

console.log(`\
import {Mesh} from "../lib/mesh.js";
import {
    GL_ARRAY_BUFFER,
    GL_ELEMENT_ARRAY_BUFFER,
    GL_FLOAT,
    GL_STATIC_DRAW,
} from "../lib/webgl.js";
import {Attribute} from "../materials/layout.js";

export function mesh_${process.argv[2]}(gl: WebGL2RenderingContext): Mesh {
    let vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);

    let vertex_buf = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, vertex_buf);
    gl.bufferData(GL_ARRAY_BUFFER, vertex_arr, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(Attribute.Position);
    gl.vertexAttribPointer(Attribute.Position, 3, GL_FLOAT, false, 0, 0);

    let normal_buf = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, normal_buf);
    gl.bufferData(GL_ARRAY_BUFFER, normal_arr, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(Attribute.Normal);
    gl.vertexAttribPointer(Attribute.Normal, 3, GL_FLOAT, false, 0, 0);

    let texcoord_buf = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, texcoord_buf);
    gl.bufferData(GL_ARRAY_BUFFER, texcoord_arr, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(Attribute.TexCoord);
    gl.vertexAttribPointer(Attribute.TexCoord, 2, GL_FLOAT, false, 0, 0);

    let weights_buf = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, weights_buf);
    gl.bufferData(GL_ARRAY_BUFFER, weights_arr, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(Attribute.Weights);
    gl.vertexAttribPointer(Attribute.Weights, 4, GL_FLOAT, false, 0, 0);

    let index_buf = gl.createBuffer()!;
    gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, index_buf);
    gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, index_arr, GL_STATIC_DRAW);

    gl.bindVertexArray(null);

    return {
        Vao: vao,
        VertexBuffer: vertex_buf,
        VertexArray: vertex_arr,
        NormalBuffer: normal_buf,
        NormalArray: normal_arr,
        TexCoordBuffer: texcoord_buf,
        TexCoordArray: texcoord_arr,
        WeightsBuffer: weights_buf,
        WeightsArray: weights_arr,
        IndexBuffer: index_buf,
        IndexArray: index_arr,
        IndexCount: index_arr.length,
    };
}

// prettier-ignore
let vertex_arr = Float32Array.from([${break_every(3, position_data, PRECISION)}]);

// prettier-ignore
let normal_arr = Float32Array.from([${break_every(3, normal_data, PRECISION)}]);

// prettier-ignore
let texcoord_arr = Float32Array.from([${break_every(2, texcoord_data, PRECISION)}]);

// prettier-ignore
let weights_arr = Float32Array.from([${break_every(4, weighted_joints, PRECISION)}]);

// prettier-ignore
let index_arr = Uint16Array.from([${break_every(
    3,
    Array.from(index_data)
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
)}]);`);

if (gltf.skins) {
    let skin = gltf.skins[0];
    let bind_poses_accessor = gltf.accessors[skin.inverseBindMatrices];
    let bind_poses_view = gltf.bufferViews[bind_poses_accessor.bufferView];
    let bind_poses_data = new Float32Array(
        buffer.buffer,
        buffer.byteOffset + bind_poses_view.byteOffset,
        bind_poses_view.byteLength / 4
    );

    console.log("\n/* Inverse bind pose matrices:");
    for (let j = 0; j < bind_poses_accessor.count; j++) {
        let joint_index = skin.joints[j];
        let name = gltf.nodes[joint_index].name;
        let mat = bind_poses_data.subarray(j * 16, j * 16 + 16);
        console.log(name, Array.from(mat, (x) => x.toFixed(PRECISION)).join(", "));
    }
    console.log("*/");
}
