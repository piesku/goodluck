import {Vec3} from "./math.js";
import {element, float} from "./random.js";
import {cross, length, normalize, subtract} from "./vec3.js";

export interface Mesh {
    Vao: WebGLVertexArrayObject;
    VertexBuffer: WebGLBuffer;
    VertexArray: Float32Array;
    NormalBuffer: WebGLBuffer;
    NormalArray: Float32Array;
    TexCoordBuffer: WebGLBuffer;
    TexCoordArray: Float32Array;
    WeightsBuffer: WebGLBuffer;
    WeightsArray: Float32Array;
    IndexBuffer: WebGLBuffer;
    IndexArray: Uint16Array;
    IndexCount: number;
}

/** Face vertex indices by face index. */
export function face_vertices(out: Vec3, mesh: Mesh, index: number): Vec3 {
    out[0] = mesh.IndexArray[index * 3 + 0];
    out[1] = mesh.IndexArray[index * 3 + 1];
    out[2] = mesh.IndexArray[index * 3 + 2];
    return out;
}

/** Centroid of the face given by a Vec3 of vertex indices. */
export function face_centroid(out: Vec3, mesh: Mesh, face: Vec3): Vec3 {
    out[0] =
        (mesh.VertexArray[face[0] * 3 + 0] +
            mesh.VertexArray[face[1] * 3 + 0] +
            mesh.VertexArray[face[2] * 3 + 0]) /
        3;
    out[1] =
        (mesh.VertexArray[face[0] * 3 + 1] +
            mesh.VertexArray[face[1] * 3 + 1] +
            mesh.VertexArray[face[2] * 3 + 1]) /
        3;
    out[2] =
        (mesh.VertexArray[face[0] * 3 + 2] +
            mesh.VertexArray[face[1] * 3 + 2] +
            mesh.VertexArray[face[2] * 3 + 2]) /
        3;
    return out;
}

const edge1: Vec3 = [0, 0, 0];
const edge2: Vec3 = [0, 0, 0];

/** Cross product of two face edges: bc×ab. */
export function face_cross(out: Vec3, mesh: Mesh, face: Vec3): Vec3 {
    subtract(
        edge1,
        [
            mesh.VertexArray[face[1] * 3 + 0],
            mesh.VertexArray[face[1] * 3 + 1],
            mesh.VertexArray[face[1] * 3 + 2],
        ],
        [
            mesh.VertexArray[face[0] * 3 + 0],
            mesh.VertexArray[face[0] * 3 + 1],
            mesh.VertexArray[face[0] * 3 + 2],
        ]
    );

    subtract(
        edge2,
        [
            mesh.VertexArray[face[2] * 3 + 0],
            mesh.VertexArray[face[2] * 3 + 1],
            mesh.VertexArray[face[2] * 3 + 2],
        ],
        [
            mesh.VertexArray[face[1] * 3 + 0],
            mesh.VertexArray[face[1] * 3 + 1],
            mesh.VertexArray[face[1] * 3 + 2],
        ]
    );

    return cross(out, edge2, edge1);
}

/** Normal of the face given by a Vec3 of vertex indices. */
export function face_normal(out: Vec3, mesh: Mesh, face: Vec3): Vec3 {
    face_cross(out, mesh, face);
    return normalize(out, out);
}

const temp: Vec3 = [0, 0, 0];

/** Area of the face given by a Vec3 of vertex indices. */
export function face_area(mesh: Mesh, face: Vec3): number {
    face_cross(temp, mesh, face);
    return length(temp) / 2;
}

export function random_point_facing_up(mesh: Mesh, min_area = 3): Vec3 | null {
    let up_face_indices: Array<number> = [];

    let face_count = mesh.IndexCount / 3;
    let face: Vec3 = [0, 0, 0];
    let norm: Vec3 = [0, 0, 0];

    for (let f = 0; f < face_count; f++) {
        face_vertices(face, mesh, f);
        let area = face_area(mesh, face);

        if (area > min_area) {
            // This computes the cross product again; optimize?
            face_normal(norm, mesh, face);
            if (norm[1] === 1) {
                let times = area - min_area + 1;
                for (let i = 0; i < times; i++) {
                    up_face_indices.push(f);
                }
            }
        }
    }

    if (up_face_indices.length === 0) {
        // No faces facing up.
        return null;
    }

    let f = element(up_face_indices);
    face_vertices(face, mesh, f);

    let p0: Vec3 = [
        mesh.VertexArray[face[0] * 3 + 0],
        mesh.VertexArray[face[0] * 3 + 1],
        mesh.VertexArray[face[0] * 3 + 2],
    ];
    let p1: Vec3 = [
        mesh.VertexArray[face[1] * 3 + 0],
        mesh.VertexArray[face[1] * 3 + 1],
        mesh.VertexArray[face[1] * 3 + 2],
    ];
    let p2: Vec3 = [
        mesh.VertexArray[face[2] * 3 + 0],
        mesh.VertexArray[face[2] * 3 + 1],
        mesh.VertexArray[face[2] * 3 + 2],
    ];

    // Random barycentric coords.
    let t0 = float(0.1, 0.8);
    let t1 = float(0.1, 0.8);
    if (t0 + t1 > 1) {
        t0 = 1 - t0;
        t1 = 1 - t1;
    }
    let t2 = 1 - t0 - t1;

    // Convert barycentric to cartesian.
    return [
        t0 * p0[0] + t1 * p1[0] + t2 * p2[0],
        t0 * p0[1] + t1 * p1[1] + t2 * p2[1],
        t0 * p0[2] + t1 * p1[2] + t2 * p2[2],
    ];
}
