import {Mesh} from "../common/mesh.js";
import {
    GL_ARRAY_BUFFER,
    GL_ELEMENT_ARRAY_BUFFER,
    GL_FLOAT,
    GL_STATIC_DRAW,
} from "../common/webgl.js";
import {Attribute} from "../materials/layout.js";

export function mesh_ludek(gl: WebGL2RenderingContext): Mesh {
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
let vertex_arr = Float32Array.from([
    -0.3, 1.2, -0.15,
    0.45, 1.47, 0,
    0.3, 1.2, -0.15,
    0.27, 0.63, 0,
    0, 0.63, 0.15,
    0.15, 0, 0,
    0.3, 1.2, 0.15,
    1.05, 1.35, 0,
    -1.05, 1.35, 0,
    -0.45, 1.47, 0,
    -0.3, 1.2, 0.15,
    0, 0.63, -0.15,
    -0.15, 0, 0,
    -0.27, 0.63, 0,
    0, 2.25, -0.15,
    0, 2.25, 0.45
]);

// prettier-ignore
let normal_arr = Float32Array.from([
    -0.424, -0.0402, -0.9048,
    0.3556, 0.9341, -0.0314,
    0.424, -0.0402, -0.9048,
    0.9544, -0.2985, 0,
    0, -0.2684, 0.9633,
    0.0912, -0.9958, 0,
    0.424, -0.0402, 0.9048,
    0.9979, 0.0645, 0,
    -0.9979, 0.0645, 0,
    -0.3556, 0.9341, -0.0314,
    -0.424, -0.0402, 0.9048,
    0, -0.2684, -0.9633,
    -0.0912, -0.9958, 0,
    -0.9544, -0.2985, 0,
    0, 0.767, -0.6416,
    0, 0.6255, 0.7802
]);

// prettier-ignore
let texcoord_arr = Float32Array.from([]);

// prettier-ignore
let weights_arr = Float32Array.from([
    3, 1, 0, 0,
    1, 0.75, 2, 0.25,
    2, 1, 0, 0,
    4, 1, 0, 0,
    4, 0.5, 5, 0.5,
    4, 1, 0, 0,
    2, 1, 0, 0,
    2, 1, 0, 0,
    3, 1, 0, 0,
    1, 0.75, 3, 0.25,
    3, 1, 0, 0,
    4, 0.5, 5, 0.5,
    5, 1, 0, 0,
    5, 1, 0, 0,
    1, 1, 0, 0,
    1, 1, 0, 0,
]);

// prettier-ignore
let index_arr = Uint16Array.from([
    15, 9, 14,
    1, 15, 14,
    9, 15, 1,
    1, 14, 9,
    2, 7, 1,
    9, 1, 6,
    6, 7, 2,
    7, 6, 1,
    6, 2, 3,
    6, 3, 4,
    5, 4, 3,
    11, 3, 2,
    4, 5, 11,
    4, 11, 12,
    11, 5, 3,
    12, 13, 4,
    13, 12, 11,
    10, 6, 4,
    10, 4, 13,
    6, 10, 9,
    8, 9, 10,
    0, 11, 2,
    0, 13, 11,
    1, 9, 0,
    10, 0, 8,
    0, 10, 13,
    9, 8, 0,
    2, 1, 0
]);
