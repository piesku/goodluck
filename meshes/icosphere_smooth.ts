import {Mesh} from "../common/mesh.js";
import {Attribute} from "../materials/layout.js";
import {GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_STATIC_DRAW} from "../common/webgl.js";

export function mesh_icosphere_smooth(gl: WebGL2RenderingContext): Mesh {
    let vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);

    let vertex_buf = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, vertex_buf);
    gl.bufferData(GL_ARRAY_BUFFER, vertex_arr, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(Attribute.Position);
    gl.vertexAttribPointer(Attribute.Position, 3, gl.FLOAT, false, 0, 0);

    let normal_buf = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, normal_buf);
    gl.bufferData(GL_ARRAY_BUFFER, normal_arr, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(Attribute.Normal);
    gl.vertexAttribPointer(Attribute.Normal, 3, gl.FLOAT, false, 0, 0);

    let texcoord_buf = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, texcoord_buf);
    gl.bufferData(GL_ARRAY_BUFFER, texcoord_arr, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(Attribute.TexCoord);
    gl.vertexAttribPointer(Attribute.TexCoord, 2, gl.FLOAT, false, 0, 0);

    let weights_buf = gl.createBuffer()!;
    gl.bindBuffer(GL_ARRAY_BUFFER, weights_buf);
    gl.bufferData(GL_ARRAY_BUFFER, weights_arr, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(Attribute.Weights);
    gl.vertexAttribPointer(Attribute.Weights, 4, gl.FLOAT, false, 0, 0);

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
    0, -0.5, 0,
    0.223605, -0.425327, 0.154506,
    -0.085408, -0.425327, 0.249998,
    0.380422, -0.22361, 0.262863,
    0.223605, -0.425327, 0.154506,
    0.447211, -0.262868, 0,
    0, -0.5, 0,
    -0.085408, -0.425327, 0.249998,
    -0.276392, -0.425326, 0,
    0, -0.5, 0,
    -0.276392, -0.425326, 0,
    -0.085408, -0.425327, -0.249998,
    0, -0.5, 0,
    -0.085408, -0.425327, -0.249998,
    0.223605, -0.425327, -0.154506,
    0.380422, -0.22361, 0.262863,
    0.447211, -0.262868, 0,
    0.5, 0, 0.154506,
    -0.145306, -0.22361, 0.425325,
    0.138198, -0.262869, 0.404506,
    0, 0, 0.5,
    -0.470227, -0.223608, 0,
    -0.361802, -0.262868, 0.249998,
    -0.5, 0, 0.154506,
    -0.145306, -0.22361, -0.425325,
    -0.361802, -0.262868, -0.249998,
    -0.309017, 0, -0.404508,
    0.380422, -0.22361, -0.262863,
    0.138198, -0.262869, -0.404506,
    0.309017, 0, -0.404508,
    0.380422, -0.22361, 0.262863,
    0.5, 0, 0.154506,
    0.309017, 0, 0.404508,
    -0.145306, -0.22361, 0.425325,
    0, 0, 0.5,
    -0.309017, 0, 0.404508,
    -0.470227, -0.223608, 0,
    -0.5, 0, 0.154506,
    -0.5, 0, -0.154506,
    -0.145306, -0.22361, -0.425325,
    -0.309017, 0, -0.404508,
    0, 0, -0.5,
    0.380422, -0.22361, -0.262863,
    0.309017, 0, -0.404508,
    0.5, 0, -0.154506,
    0.145306, 0.22361, 0.425325,
    0.361802, 0.262868, 0.249998,
    0.085408, 0.425327, 0.249998,
    -0.380422, 0.22361, 0.262863,
    -0.138198, 0.262869, 0.404506,
    -0.223605, 0.425327, 0.154506,
    -0.380422, 0.22361, -0.262863,
    -0.447211, 0.262868, 0,
    -0.223605, 0.425327, -0.154506,
    0.145306, 0.22361, -0.425325,
    -0.138198, 0.262869, -0.404506,
    0.085408, 0.425327, -0.249998,
    0.470227, 0.223608, 0,
    0.361802, 0.262868, -0.249998,
    0.276392, 0.425326, 0,
    0.276392, 0.425326, 0,
    0.085408, 0.425327, -0.249998,
    0, 0.5, 0,
    0.276392, 0.425326, 0,
    0.361802, 0.262868, -0.249998,
    0.085408, 0.425327, -0.249998,
    0.361802, 0.262868, -0.249998,
    0.145306, 0.22361, -0.425325,
    0.085408, 0.425327, -0.249998,
    0.085408, 0.425327, -0.249998,
    -0.223605, 0.425327, -0.154506,
    0, 0.5, 0,
    0.085408, 0.425327, -0.249998,
    -0.138198, 0.262869, -0.404506,
    -0.223605, 0.425327, -0.154506,
    -0.138198, 0.262869, -0.404506,
    -0.380422, 0.22361, -0.262863,
    -0.223605, 0.425327, -0.154506,
    -0.223605, 0.425327, -0.154506,
    -0.223605, 0.425327, 0.154506,
    0, 0.5, 0,
    -0.223605, 0.425327, -0.154506,
    -0.447211, 0.262868, 0,
    -0.223605, 0.425327, 0.154506,
    -0.447211, 0.262868, 0,
    -0.380422, 0.22361, 0.262863,
    -0.223605, 0.425327, 0.154506,
    -0.223605, 0.425327, 0.154506,
    0.085408, 0.425327, 0.249998,
    0, 0.5, 0,
    -0.223605, 0.425327, 0.154506,
    -0.138198, 0.262869, 0.404506,
    0.085408, 0.425327, 0.249998,
    -0.138198, 0.262869, 0.404506,
    0.145306, 0.22361, 0.425325,
    0.085408, 0.425327, 0.249998,
    0.085408, 0.425327, 0.249998,
    0.276392, 0.425326, 0,
    0, 0.5, 0,
    0.085408, 0.425327, 0.249998,
    0.361802, 0.262868, 0.249998,
    0.276392, 0.425326, 0,
    0.361802, 0.262868, 0.249998,
    0.470227, 0.223608, 0,
    0.276392, 0.425326, 0,
    0.5, 0, -0.154506,
    0.361802, 0.262868, -0.249998,
    0.470227, 0.223608, 0,
    0.5, 0, -0.154506,
    0.309017, 0, -0.404508,
    0.361802, 0.262868, -0.249998,
    0.309017, 0, -0.404508,
    0.145306, 0.22361, -0.425325,
    0.361802, 0.262868, -0.249998,
    0, 0, -0.5,
    -0.138198, 0.262869, -0.404506,
    0.145306, 0.22361, -0.425325,
    0, 0, -0.5,
    -0.309017, 0, -0.404508,
    -0.138198, 0.262869, -0.404506,
    -0.309017, 0, -0.404508,
    -0.380422, 0.22361, -0.262863,
    -0.138198, 0.262869, -0.404506,
    -0.5, 0, -0.154506,
    -0.447211, 0.262868, 0,
    -0.380422, 0.22361, -0.262863,
    -0.5, 0, -0.154506,
    -0.5, 0, 0.154506,
    -0.447211, 0.262868, 0,
    -0.5, 0, 0.154506,
    -0.380422, 0.22361, 0.262863,
    -0.447211, 0.262868, 0,
    -0.309017, 0, 0.404508,
    -0.138198, 0.262869, 0.404506,
    -0.380422, 0.22361, 0.262863,
    -0.309017, 0, 0.404508,
    0, 0, 0.5,
    -0.138198, 0.262869, 0.404506,
    0, 0, 0.5,
    0.145306, 0.22361, 0.425325,
    -0.138198, 0.262869, 0.404506,
    0.309017, 0, 0.404508,
    0.361802, 0.262868, 0.249998,
    0.145306, 0.22361, 0.425325,
    0.309017, 0, 0.404508,
    0.5, 0, 0.154506,
    0.361802, 0.262868, 0.249998,
    0.5, 0, 0.154506,
    0.470227, 0.223608, 0,
    0.361802, 0.262868, 0.249998,
    0.309017, 0, -0.404508,
    0, 0, -0.5,
    0.145306, 0.22361, -0.425325,
    0.309017, 0, -0.404508,
    0.138198, -0.262869, -0.404506,
    0, 0, -0.5,
    0.138198, -0.262869, -0.404506,
    -0.145306, -0.22361, -0.425325,
    0, 0, -0.5,
    -0.309017, 0, -0.404508,
    -0.5, 0, -0.154506,
    -0.380422, 0.22361, -0.262863,
    -0.309017, 0, -0.404508,
    -0.361802, -0.262868, -0.249998,
    -0.5, 0, -0.154506,
    -0.361802, -0.262868, -0.249998,
    -0.470227, -0.223608, 0,
    -0.5, 0, -0.154506,
    -0.5, 0, 0.154506,
    -0.309017, 0, 0.404508,
    -0.380422, 0.22361, 0.262863,
    -0.5, 0, 0.154506,
    -0.361802, -0.262868, 0.249998,
    -0.309017, 0, 0.404508,
    -0.361802, -0.262868, 0.249998,
    -0.145306, -0.22361, 0.425325,
    -0.309017, 0, 0.404508,
    0, 0, 0.5,
    0.309017, 0, 0.404508,
    0.145306, 0.22361, 0.425325,
    0, 0, 0.5,
    0.138198, -0.262869, 0.404506,
    0.309017, 0, 0.404508,
    0.138198, -0.262869, 0.404506,
    0.380422, -0.22361, 0.262863,
    0.309017, 0, 0.404508,
    0.5, 0, 0.154506,
    0.5, 0, -0.154506,
    0.470227, 0.223608, 0,
    0.5, 0, 0.154506,
    0.447211, -0.262868, 0,
    0.5, 0, -0.154506,
    0.447211, -0.262868, 0,
    0.380422, -0.22361, -0.262863,
    0.5, 0, -0.154506,
    0.223605, -0.425327, -0.154506,
    0.138198, -0.262869, -0.404506,
    0.380422, -0.22361, -0.262863,
    0.223605, -0.425327, -0.154506,
    -0.085408, -0.425327, -0.249998,
    0.138198, -0.262869, -0.404506,
    -0.085408, -0.425327, -0.249998,
    -0.145306, -0.22361, -0.425325,
    0.138198, -0.262869, -0.404506,
    -0.085408, -0.425327, -0.249998,
    -0.361802, -0.262868, -0.249998,
    -0.145306, -0.22361, -0.425325,
    -0.085408, -0.425327, -0.249998,
    -0.276392, -0.425326, 0,
    -0.361802, -0.262868, -0.249998,
    -0.276392, -0.425326, 0,
    -0.470227, -0.223608, 0,
    -0.361802, -0.262868, -0.249998,
    -0.276392, -0.425326, 0,
    -0.361802, -0.262868, 0.249998,
    -0.470227, -0.223608, 0,
    -0.276392, -0.425326, 0,
    -0.085408, -0.425327, 0.249998,
    -0.361802, -0.262868, 0.249998,
    -0.085408, -0.425327, 0.249998,
    -0.145306, -0.22361, 0.425325,
    -0.361802, -0.262868, 0.249998,
    0.447211, -0.262868, 0,
    0.223605, -0.425327, -0.154506,
    0.380422, -0.22361, -0.262863,
    0.447211, -0.262868, 0,
    0.223605, -0.425327, 0.154506,
    0.223605, -0.425327, -0.154506,
    0.223605, -0.425327, 0.154506,
    0, -0.5, 0,
    0.223605, -0.425327, -0.154506,
    -0.085408, -0.425327, 0.249998,
    0.138198, -0.262869, 0.404506,
    -0.145306, -0.22361, 0.425325,
    -0.085408, -0.425327, 0.249998,
    0.223605, -0.425327, 0.154506,
    0.138198, -0.262869, 0.404506,
    0.223605, -0.425327, 0.154506,
    0.380422, -0.22361, 0.262863,
    0.138198, -0.262869, 0.404506
]);

// prettier-ignore
let normal_arr = Float32Array.from([
    0, -1, 0,
    0.4115, -0.8568, 0.3107,
    -0.1564, -0.8515, 0.5004,
    0.7095, -0.4566, 0.5367,
    0.4115, -0.8568, 0.3107,
    0.8415, -0.5402, 0,
    0, -1, 0,
    -0.1564, -0.8515, 0.5004,
    -0.5101, -0.8601, 0,
    0, -1, 0,
    -0.5101, -0.8601, 0,
    -0.1564, -0.8515, -0.5004,
    0, -1, 0,
    -0.1564, -0.8515, -0.5004,
    0.4115, -0.8568, -0.3107,
    0.7095, -0.4566, 0.5367,
    0.8415, -0.5402, 0,
    0.9474, -0.0004, 0.3199,
    -0.2662, -0.4485, 0.8532,
    0.2529, -0.5271, 0.8113,
    0, 0, 1,
    -0.887, -0.4617, 0,
    -0.6736, -0.5351, 0.5098,
    -0.9474, 0.0004, 0.3199,
    -0.2662, -0.4485, -0.8532,
    -0.6736, -0.5351, -0.5098,
    -0.5727, -0.0005, -0.8197,
    0.7095, -0.4566, -0.5367,
    0.2529, -0.5271, -0.8113,
    0.5727, 0.0005, -0.8197,
    0.7095, -0.4566, 0.5367,
    0.9474, -0.0004, 0.3199,
    0.5727, 0.0005, 0.8197,
    -0.2662, -0.4485, 0.8532,
    0, 0, 1,
    -0.5727, -0.0005, 0.8197,
    -0.887, -0.4617, 0,
    -0.9474, 0.0004, 0.3199,
    -0.9474, 0.0004, -0.3199,
    -0.2662, -0.4485, -0.8532,
    -0.5727, -0.0005, -0.8197,
    0, 0, -1,
    0.7095, -0.4566, -0.5367,
    0.5727, 0.0005, -0.8197,
    0.9474, -0.0004, -0.3199,
    0.2662, 0.4485, 0.8532,
    0.6736, 0.5351, 0.5098,
    0.1564, 0.8515, 0.5004,
    -0.7095, 0.4566, 0.5367,
    -0.2529, 0.5271, 0.8113,
    -0.4115, 0.8568, 0.3107,
    -0.7095, 0.4566, -0.5367,
    -0.8415, 0.5402, 0,
    -0.4115, 0.8568, -0.3107,
    0.2662, 0.4485, -0.8532,
    -0.2529, 0.5271, -0.8113,
    0.1564, 0.8515, -0.5004,
    0.887, 0.4617, 0,
    0.6736, 0.5351, -0.5098,
    0.5101, 0.8601, 0,
    0.5101, 0.8601, 0,
    0.1564, 0.8515, -0.5004,
    0, 1, 0,
    0.5101, 0.8601, 0,
    0.6736, 0.5351, -0.5098,
    0.1564, 0.8515, -0.5004,
    0.6736, 0.5351, -0.5098,
    0.2662, 0.4485, -0.8532,
    0.1564, 0.8515, -0.5004,
    0.1564, 0.8515, -0.5004,
    -0.4115, 0.8568, -0.3107,
    0, 1, 0,
    0.1564, 0.8515, -0.5004,
    -0.2529, 0.5271, -0.8113,
    -0.4115, 0.8568, -0.3107,
    -0.2529, 0.5271, -0.8113,
    -0.7095, 0.4566, -0.5367,
    -0.4115, 0.8568, -0.3107,
    -0.4115, 0.8568, -0.3107,
    -0.4115, 0.8568, 0.3107,
    0, 1, 0,
    -0.4115, 0.8568, -0.3107,
    -0.8415, 0.5402, 0,
    -0.4115, 0.8568, 0.3107,
    -0.8415, 0.5402, 0,
    -0.7095, 0.4566, 0.5367,
    -0.4115, 0.8568, 0.3107,
    -0.4115, 0.8568, 0.3107,
    0.1564, 0.8515, 0.5004,
    0, 1, 0,
    -0.4115, 0.8568, 0.3107,
    -0.2529, 0.5271, 0.8113,
    0.1564, 0.8515, 0.5004,
    -0.2529, 0.5271, 0.8113,
    0.2662, 0.4485, 0.8532,
    0.1564, 0.8515, 0.5004,
    0.1564, 0.8515, 0.5004,
    0.5101, 0.8601, 0,
    0, 1, 0,
    0.1564, 0.8515, 0.5004,
    0.6736, 0.5351, 0.5098,
    0.5101, 0.8601, 0,
    0.6736, 0.5351, 0.5098,
    0.887, 0.4617, 0,
    0.5101, 0.8601, 0,
    0.9474, -0.0004, -0.3199,
    0.6736, 0.5351, -0.5098,
    0.887, 0.4617, 0,
    0.9474, -0.0004, -0.3199,
    0.5727, 0.0005, -0.8197,
    0.6736, 0.5351, -0.5098,
    0.5727, 0.0005, -0.8197,
    0.2662, 0.4485, -0.8532,
    0.6736, 0.5351, -0.5098,
    0, 0, -1,
    -0.2529, 0.5271, -0.8113,
    0.2662, 0.4485, -0.8532,
    0, 0, -1,
    -0.5727, -0.0005, -0.8197,
    -0.2529, 0.5271, -0.8113,
    -0.5727, -0.0005, -0.8197,
    -0.7095, 0.4566, -0.5367,
    -0.2529, 0.5271, -0.8113,
    -0.9474, 0.0004, -0.3199,
    -0.8415, 0.5402, 0,
    -0.7095, 0.4566, -0.5367,
    -0.9474, 0.0004, -0.3199,
    -0.9474, 0.0004, 0.3199,
    -0.8415, 0.5402, 0,
    -0.9474, 0.0004, 0.3199,
    -0.7095, 0.4566, 0.5367,
    -0.8415, 0.5402, 0,
    -0.5727, -0.0005, 0.8197,
    -0.2529, 0.5271, 0.8113,
    -0.7095, 0.4566, 0.5367,
    -0.5727, -0.0005, 0.8197,
    0, 0, 1,
    -0.2529, 0.5271, 0.8113,
    0, 0, 1,
    0.2662, 0.4485, 0.8532,
    -0.2529, 0.5271, 0.8113,
    0.5727, 0.0005, 0.8197,
    0.6736, 0.5351, 0.5098,
    0.2662, 0.4485, 0.8532,
    0.5727, 0.0005, 0.8197,
    0.9474, -0.0004, 0.3199,
    0.6736, 0.5351, 0.5098,
    0.9474, -0.0004, 0.3199,
    0.887, 0.4617, 0,
    0.6736, 0.5351, 0.5098,
    0.5727, 0.0005, -0.8197,
    0, 0, -1,
    0.2662, 0.4485, -0.8532,
    0.5727, 0.0005, -0.8197,
    0.2529, -0.5271, -0.8113,
    0, 0, -1,
    0.2529, -0.5271, -0.8113,
    -0.2662, -0.4485, -0.8532,
    0, 0, -1,
    -0.5727, -0.0005, -0.8197,
    -0.9474, 0.0004, -0.3199,
    -0.7095, 0.4566, -0.5367,
    -0.5727, -0.0005, -0.8197,
    -0.6736, -0.5351, -0.5098,
    -0.9474, 0.0004, -0.3199,
    -0.6736, -0.5351, -0.5098,
    -0.887, -0.4617, 0,
    -0.9474, 0.0004, -0.3199,
    -0.9474, 0.0004, 0.3199,
    -0.5727, -0.0005, 0.8197,
    -0.7095, 0.4566, 0.5367,
    -0.9474, 0.0004, 0.3199,
    -0.6736, -0.5351, 0.5098,
    -0.5727, -0.0005, 0.8197,
    -0.6736, -0.5351, 0.5098,
    -0.2662, -0.4485, 0.8532,
    -0.5727, -0.0005, 0.8197,
    0, 0, 1,
    0.5727, 0.0005, 0.8197,
    0.2662, 0.4485, 0.8532,
    0, 0, 1,
    0.2529, -0.5271, 0.8113,
    0.5727, 0.0005, 0.8197,
    0.2529, -0.5271, 0.8113,
    0.7095, -0.4566, 0.5367,
    0.5727, 0.0005, 0.8197,
    0.9474, -0.0004, 0.3199,
    0.9474, -0.0004, -0.3199,
    0.887, 0.4617, 0,
    0.9474, -0.0004, 0.3199,
    0.8415, -0.5402, 0,
    0.9474, -0.0004, -0.3199,
    0.8415, -0.5402, 0,
    0.7095, -0.4566, -0.5367,
    0.9474, -0.0004, -0.3199,
    0.4115, -0.8568, -0.3107,
    0.2529, -0.5271, -0.8113,
    0.7095, -0.4566, -0.5367,
    0.4115, -0.8568, -0.3107,
    -0.1564, -0.8515, -0.5004,
    0.2529, -0.5271, -0.8113,
    -0.1564, -0.8515, -0.5004,
    -0.2662, -0.4485, -0.8532,
    0.2529, -0.5271, -0.8113,
    -0.1564, -0.8515, -0.5004,
    -0.6736, -0.5351, -0.5098,
    -0.2662, -0.4485, -0.8532,
    -0.1564, -0.8515, -0.5004,
    -0.5101, -0.8601, 0,
    -0.6736, -0.5351, -0.5098,
    -0.5101, -0.8601, 0,
    -0.887, -0.4617, 0,
    -0.6736, -0.5351, -0.5098,
    -0.5101, -0.8601, 0,
    -0.6736, -0.5351, 0.5098,
    -0.887, -0.4617, 0,
    -0.5101, -0.8601, 0,
    -0.1564, -0.8515, 0.5004,
    -0.6736, -0.5351, 0.5098,
    -0.1564, -0.8515, 0.5004,
    -0.2662, -0.4485, 0.8532,
    -0.6736, -0.5351, 0.5098,
    0.8415, -0.5402, 0,
    0.4115, -0.8568, -0.3107,
    0.7095, -0.4566, -0.5367,
    0.8415, -0.5402, 0,
    0.4115, -0.8568, 0.3107,
    0.4115, -0.8568, -0.3107,
    0.4115, -0.8568, 0.3107,
    0, -1, 0,
    0.4115, -0.8568, -0.3107,
    -0.1564, -0.8515, 0.5004,
    0.2529, -0.5271, 0.8113,
    -0.2662, -0.4485, 0.8532,
    -0.1564, -0.8515, 0.5004,
    0.4115, -0.8568, 0.3107,
    0.2529, -0.5271, 0.8113,
    0.4115, -0.8568, 0.3107,
    0.7095, -0.4566, 0.5367,
    0.2529, -0.5271, 0.8113
]);

// prettier-ignore
let texcoord_arr = Float32Array.from([
    0.998999, 0.284713,
    0.998999, 0.144859,
    0.859145, 0.284713,
    0.42757, 0.141856,
    0.42757, 0.002002,
    0.287716, 0.141856,
    0.284713, 0.998999,
    0.144859, 0.998999,
    0.284713, 0.859145,
    0.143858, 0.858144,
    0.143858, 0.997998,
    0.283712, 0.858144,
    0.858144, 0.143858,
    0.997998, 0.143858,
    0.858144, 0.283712,
    0.284713, 0.570428,
    0.144859, 0.570428,
    0.284713, 0.430573,
    0.570428, 0.713285,
    0.570428, 0.573431,
    0.430573, 0.713285,
    0.42757, 0.713285,
    0.42757, 0.573431,
    0.287716, 0.713285,
    0.713285, 0.141856,
    0.713285, 0.002002,
    0.573431, 0.141856,
    0.570428, 0.42757,
    0.570428, 0.287716,
    0.430573, 0.42757,
    0.284713, 0.713285,
    0.284713, 0.573431,
    0.144859, 0.713285,
    0.141856, 0.713285,
    0.002002, 0.713285,
    0.141856, 0.573431,
    0.42757, 0.570428,
    0.42757, 0.430573,
    0.287716, 0.570428,
    0.856142, 0.141856,
    0.856142, 0.002002,
    0.716288, 0.141856,
    0.713285, 0.570428,
    0.573431, 0.570428,
    0.713285, 0.430573,
    0.141856, 0.998999,
    0.141856, 0.859145,
    0.002002, 0.998999,
    0.141856, 0.141856,
    0.141856, 0.002002,
    0.002002, 0.141856,
    0.998999, 0.141856,
    0.859145, 0.141856,
    0.998999, 0.002002,
    0.713285, 0.856142,
    0.713285, 0.716288,
    0.573431, 0.856142,
    0.42757, 0.42757,
    0.287716, 0.42757,
    0.42757, 0.287716,
    0.856142, 0.430573,
    0.716288, 0.570428,
    0.856142, 0.570428,
    0.570428, 0.856142,
    0.430573, 0.856142,
    0.570428, 0.716288,
    0.001001, 0.997998,
    0.001001, 0.858144,
    0.140855, 0.858144,
    0.716288, 0.856142,
    0.856142, 0.716288,
    0.856142, 0.856142,
    0.856142, 0.573431,
    0.856142, 0.713285,
    0.716288, 0.713285,
    0.570428, 0.002002,
    0.570428, 0.141856,
    0.430573, 0.141856,
    0.284713, 0.144859,
    0.144859, 0.284713,
    0.284713, 0.284713,
    0.141856, 0.42757,
    0.141856, 0.287716,
    0.002002, 0.42757,
    0.997998, 0.001001,
    0.858144, 0.001001,
    0.858144, 0.140855,
    0.715287, 0.855141,
    0.855141, 0.715287,
    0.715287, 0.715287,
    0.855141, 0.57243,
    0.715287, 0.57243,
    0.715287, 0.712284,
    0.57243, 0.855141,
    0.57243, 0.715287,
    0.712284, 0.715287,
    0.855141, 0.429572,
    0.715287, 0.569427,
    0.715287, 0.429572,
    0.429572, 0.855141,
    0.569427, 0.715287,
    0.429572, 0.715287,
    0.002002, 0.570428,
    0.141856, 0.570428,
    0.141856, 0.430573,
    0.002002, 0.856142,
    0.141856, 0.716288,
    0.141856, 0.856142,
    0.713285, 0.144859,
    0.573431, 0.284713,
    0.713285, 0.284713,
    0.716288, 0.284713,
    0.856142, 0.284713,
    0.856142, 0.144859,
    0.144859, 0.856142,
    0.284713, 0.716288,
    0.284713, 0.856142,
    0.430573, 0.570428,
    0.570428, 0.430573,
    0.570428, 0.570428,
    0.287716, 0.856142,
    0.42757, 0.856142,
    0.42757, 0.716288,
    0.856142, 0.287716,
    0.716288, 0.42757,
    0.856142, 0.42757,
    0.430573, 0.284713,
    0.570428, 0.284713,
    0.570428, 0.144859,
    0.715287, 0.426569,
    0.715287, 0.286715,
    0.855141, 0.286715,
    0.426569, 0.715287,
    0.286715, 0.855141,
    0.286715, 0.715287,
    0.713285, 0.573431,
    0.573431, 0.713285,
    0.713285, 0.713285,
    0.283712, 0.715287,
    0.143858, 0.715287,
    0.143858, 0.855141,
    0.855141, 0.143858,
    0.715287, 0.283712,
    0.715287, 0.143858,
    0.573431, 0.42757,
    0.713285, 0.287716,
    0.713285, 0.42757,
    0.140855, 0.715287,
    0.001001, 0.715287,
    0.001001, 0.855141,
    0.715287, 0.140855,
    0.855141, 0.001001,
    0.715287, 0.001001,
    0.57243, 0.712284,
    0.57243, 0.57243,
    0.712284, 0.57243,
    0.429572, 0.712284,
    0.429572, 0.57243,
    0.569427, 0.57243,
    0.712284, 0.429572,
    0.57243, 0.569427,
    0.57243, 0.429572,
    0.712284, 0.286715,
    0.57243, 0.286715,
    0.57243, 0.426569,
    0.286715, 0.712284,
    0.286715, 0.57243,
    0.426569, 0.57243,
    0.143858, 0.712284,
    0.283712, 0.57243,
    0.143858, 0.57243,
    0.57243, 0.283712,
    0.57243, 0.143858,
    0.712284, 0.143858,
    0.57243, 0.140855,
    0.57243, 0.001001,
    0.712284, 0.001001,
    0.140855, 0.57243,
    0.001001, 0.712284,
    0.001001, 0.57243,
    0.569427, 0.429572,
    0.429572, 0.429572,
    0.429572, 0.569427,
    0.429572, 0.426569,
    0.429572, 0.286715,
    0.569427, 0.286715,
    0.286715, 0.569427,
    0.426569, 0.429572,
    0.286715, 0.429572,
    0.569427, 0.143858,
    0.429572, 0.283712,
    0.429572, 0.143858,
    0.283712, 0.429572,
    0.143858, 0.429572,
    0.143858, 0.569427,
    0.569427, 0.001001,
    0.429572, 0.140855,
    0.429572, 0.001001,
    0.002002, 0.284713,
    0.141856, 0.144859,
    0.141856, 0.284713,
    0.144859, 0.141856,
    0.284713, 0.141856,
    0.284713, 0.002002,
    0.287716, 0.284713,
    0.42757, 0.144859,
    0.42757, 0.284713,
    0.284713, 0.287716,
    0.284713, 0.42757,
    0.144859, 0.42757,
    0.001001, 0.569427,
    0.001001, 0.429572,
    0.140855, 0.429572,
    0.286715, 0.426569,
    0.426569, 0.286715,
    0.286715, 0.286715,
    0.143858, 0.286715,
    0.143858, 0.426569,
    0.283712, 0.286715,
    0.426569, 0.143858,
    0.286715, 0.143858,
    0.286715, 0.283712,
    0.426569, 0.001001,
    0.286715, 0.140855,
    0.286715, 0.001001,
    0.001001, 0.426569,
    0.001001, 0.286715,
    0.140855, 0.286715,
    0.143858, 0.283712,
    0.143858, 0.143858,
    0.283712, 0.143858,
    0.283712, 0.001001,
    0.143858, 0.140855,
    0.143858, 0.001001,
    0.001001, 0.283712,
    0.140855, 0.143858,
    0.001001, 0.143858,
    0.140855, 0.001001,
    0.001001, 0.001001,
    0.001001, 0.140855
]);

// prettier-ignore
let weights_arr = Float32Array.from([
    // Weights must be assigned manually for now b/c OBJ doesn't support them.
    // WARNING: Remaking the mesh file will overwrite your weights here.
]);

// prettier-ignore
let index_arr = Uint16Array.from([
    239, 238, 237,
    236, 235, 234,
    233, 232, 231,
    230, 229, 228,
    227, 226, 225,
    224, 223, 222,
    221, 220, 219,
    218, 217, 216,
    215, 214, 213,
    212, 211, 210,
    209, 208, 207,
    206, 205, 204,
    203, 202, 201,
    200, 199, 198,
    197, 196, 195,
    194, 193, 192,
    191, 190, 189,
    188, 187, 186,
    185, 184, 183,
    182, 181, 180,
    179, 178, 177,
    176, 175, 174,
    173, 172, 171,
    170, 169, 168,
    167, 166, 165,
    164, 163, 162,
    161, 160, 159,
    158, 157, 156,
    155, 154, 153,
    152, 151, 150,
    149, 148, 147,
    146, 145, 144,
    143, 142, 141,
    140, 139, 138,
    137, 136, 135,
    134, 133, 132,
    131, 130, 129,
    128, 127, 126,
    125, 124, 123,
    122, 121, 120,
    119, 118, 117,
    116, 115, 114,
    113, 112, 111,
    110, 109, 108,
    107, 106, 105,
    104, 103, 102,
    101, 100, 99,
    98, 97, 96,
    95, 94, 93,
    92, 91, 90,
    89, 88, 87,
    86, 85, 84,
    83, 82, 81,
    80, 79, 78,
    77, 76, 75,
    74, 73, 72,
    71, 70, 69,
    68, 67, 66,
    65, 64, 63,
    62, 61, 60,
    59, 58, 57,
    56, 55, 54,
    53, 52, 51,
    50, 49, 48,
    47, 46, 45,
    44, 43, 42,
    41, 40, 39,
    38, 37, 36,
    35, 34, 33,
    32, 31, 30,
    29, 28, 27,
    26, 25, 24,
    23, 22, 21,
    20, 19, 18,
    17, 16, 15,
    14, 13, 12,
    11, 10, 9,
    8, 7, 6,
    5, 4, 3,
    2, 1, 0
]);
