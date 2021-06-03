import {Vec3} from "./math.js";
import {cross, normalize, subtract} from "./vec3.js";

export interface Mesh {
    VertexBuffer: WebGLBuffer;
    VertexArray: Float32Array;
    NormalBuffer: WebGLBuffer;
    NormalArray: Float32Array;
    TexCoordBuffer: WebGLBuffer;
    TexCoordArray: Float32Array;
    IndexBuffer: WebGLBuffer;
    IndexArray: Uint16Array;
    IndexCount: number;
}

export function face_centroid(vertices: Float32Array, a: number, b: number, c: number): Vec3 {
    return [
        (vertices[a * 3 + 0] + vertices[b * 3 + 0] + vertices[c * 3 + 0]) / 3,
        (vertices[a * 3 + 1] + vertices[b * 3 + 1] + vertices[c * 3 + 1]) / 3,
        (vertices[a * 3 + 2] + vertices[b * 3 + 2] + vertices[c * 3 + 2]) / 3,
    ];
}

const edge1: Vec3 = [0, 0, 0];
const edge2: Vec3 = [0, 0, 0];

export function face_normal(vertices: Float32Array, a: number, b: number, c: number): Vec3 {
    subtract(
        edge1,
        [vertices[b * 3 + 0], vertices[b * 3 + 1], vertices[b * 3 + 2]],
        [vertices[a * 3 + 0], vertices[a * 3 + 1], vertices[a * 3 + 2]]
    );

    subtract(
        edge2,
        [vertices[c * 3 + 0], vertices[c * 3 + 1], vertices[c * 3 + 2]],
        [vertices[b * 3 + 0], vertices[b * 3 + 1], vertices[b * 3 + 2]]
    );

    let product = cross([0, 0, 0], edge2, edge1);
    return normalize(product, product);
}
