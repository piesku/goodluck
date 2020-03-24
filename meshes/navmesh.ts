import {Mesh} from "../common/material.js";
import {GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_STATIC_DRAW} from "../common/webgl.js";

export function mesh_navmesh(gl: WebGLRenderingContext): Mesh {
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
    -7.12639,
    0,
    -9.78493,
    6.85151,
    0,
    -20.4454,
    -18.1395,
    0,
    -21.3651,
    -10.0403,
    0,
    -31.5829,
    -20.9654,
    0,
    -33.8989,
    -12.3547,
    0,
    -43.7628,
    10.0371,
    0,
    -4.0636,
    -5.35723,
    0,
    8.37206,
    25.3423,
    0,
    -26.3495,
    19.7676,
    0,
    -32.8344,
    30.9577,
    0,
    -44.4389,
    36.8331,
    0,
    -37.3852,
    35.8092,
    0,
    -49.1035,
    48.324,
    0,
    -48.4209,
    -7.5373,
    0,
    -43.8701,
    32.965,
    0,
    -7.80488,
    49.1204,
    0,
    -32.3793,
    -18.3757,
    0,
    0.088326,
    -23.8597,
    0,
    -7.54379,
    -19.9808,
    0,
    6.95461,
    -15.433,
    0,
    24.7891,
    5.87922,
    0,
    18.6362,
    -2.85968,
    0,
    33.6172,
    -26.4904,
    0,
    37.0949,
    -17.5731,
    0,
    41.0185,
    -29.2547,
    0,
    40.6618,
    -32.0191,
    0,
    28.891,
    -39.5096,
    0,
    32.2796,
    -47.8026,
    0,
    39.1459,
    15.3315,
    0,
    33.8847,
    20.1745,
    0,
    21.2779,
    28.9749,
    0,
    28.891,
    31.0259,
    0,
    17.0311,
    49.217,
    0,
    30.4962,
    49.217,
    0,
    1.7826,
    -34.6916,
    -0.000001,
    -3.17503,
    -33.9402,
    -0.000001,
    -11.7948,
    24.2398,
    -0.000001,
    7.86047,
]);

let normals = Float32Array.from([
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    -1.78941e-8,
    1,
    1.28578e-8,
    -4.18152e-8,
    1,
    1.07724e-8,
    0,
    1,
    0,
    0,
    1,
    0,
    2.60848e-9,
    1,
    -1.41157e-8,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    -4.00989e-9,
    1,
    -3.1027e-8,
    0,
    1,
    0,
    -8.27295e-9,
    1,
    -2.11392e-8,
    0,
    1,
    0,
    0,
    1,
    0,
    -8.36305e-8,
    1,
    2.15447e-8,
    -9.56844e-8,
    1,
    -8.34171e-9,
    -1.00247e-8,
    1,
    -7.75676e-8,
]);

let texcoords = Float32Array.from([]);

let indices = Uint16Array.from([
    34,
    33,
    32,
    33,
    31,
    32,
    32,
    31,
    30,
    31,
    29,
    30,
    37,
    32,
    30,
    28,
    27,
    25,
    27,
    26,
    25,
    26,
    23,
    25,
    25,
    23,
    24,
    24,
    23,
    22,
    21,
    37,
    30,
    30,
    29,
    21,
    29,
    22,
    21,
    23,
    20,
    22,
    22,
    20,
    21,
    21,
    20,
    7,
    20,
    19,
    7,
    19,
    17,
    7,
    36,
    18,
    35,
    35,
    18,
    17,
    13,
    16,
    11,
    12,
    13,
    11,
    12,
    11,
    10,
    11,
    8,
    10,
    8,
    15,
    6,
    9,
    10,
    8,
    5,
    14,
    3,
    4,
    5,
    3,
    4,
    3,
    2,
    3,
    1,
    2,
    1,
    9,
    8,
    1,
    8,
    6,
    2,
    0,
    18,
    18,
    0,
    17,
    17,
    0,
    7,
    1,
    6,
    0,
    7,
    0,
    6,
    2,
    1,
    0,
]);
