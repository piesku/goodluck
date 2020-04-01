import {Mesh} from "../common/material.js";
import {Vec3} from "../common/math.js";
import {cross, distance_squared, normalize, subtract} from "../common/vec3.js";

export interface NavMesh {
    Graph: Array<Array<[number, number]>>;
    Centroids: Array<Vec3>;
}

export function nav_bake(mesh: Mesh) {
    let face_count = mesh.IndexCount / 3;
    let faces_containing_vertex: Record<number, Array<number>> = {};

    let navmesh: NavMesh = {
        Graph: [],
        Centroids: [],
    };

    // Prepare data for graph building.
    for (let face = 0; face < face_count; face++) {
        let v1 = mesh.IndexArray[face * 3 + 0];
        let v2 = mesh.IndexArray[face * 3 + 1];
        let v3 = mesh.IndexArray[face * 3 + 2];

        let norm = normal(mesh.VertexArray, v1, v2, v3);
        if (norm[1] < 0.8) {
            // Skip this face, it's not horizontal enough.
            continue;
        }

        navmesh.Graph[face] = [];
        navmesh.Centroids[face] = centroid(mesh.VertexArray, v1, v2, v3);

        for (let i = 0; i < 3; i++) {
            let vert = mesh.IndexArray[face * 3 + i];
            if (faces_containing_vertex[vert]) {
                faces_containing_vertex[vert].push(face);
            } else {
                faces_containing_vertex[vert] = [face];
            }
        }
    }

    // Build the graph.
    for (let face = 0; face < face_count; face++) {
        if (navmesh.Graph[face] === undefined) {
            continue;
        }

        let edges = [
            [mesh.IndexArray[face * 3 + 0], mesh.IndexArray[face * 3 + 1]],
            [mesh.IndexArray[face * 3 + 1], mesh.IndexArray[face * 3 + 2]],
            [mesh.IndexArray[face * 3 + 2], mesh.IndexArray[face * 3 + 0]],
        ];

        for (let [a, b] of edges) {
            // For every of the three edges of the face, check if any of the
            // other faces containing the first vertex of the edge also contains
            // the second one. If so, the faces are adjacent.
            for (let other of faces_containing_vertex[a]) {
                if (
                    other !== face &&
                    (mesh.IndexArray[other * 3 + 0] === b ||
                        mesh.IndexArray[other * 3 + 1] === b ||
                        mesh.IndexArray[other * 3 + 2] === b)
                ) {
                    navmesh.Graph[face].push([
                        other,
                        distance_squared(navmesh.Centroids[face], navmesh.Centroids[other]),
                    ]);
                    break;
                }
            }
        }
    }

    return navmesh;
}

function centroid(vertices: Float32Array, a: number, b: number, c: number): Vec3 {
    return [
        (vertices[a * 3 + 0] + vertices[b * 3 + 0] + vertices[c * 3 + 0]) / 3,
        (vertices[a * 3 + 1] + vertices[b * 3 + 1] + vertices[c * 3 + 1]) / 3,
        (vertices[a * 3 + 2] + vertices[b * 3 + 2] + vertices[c * 3 + 2]) / 3,
    ];
}

function normal(vertices: Float32Array, a: number, b: number, c: number): Vec3 {
    let edge1: Vec3 = subtract(
        [0, 0, 0],
        [vertices[b * 3 + 0], vertices[b * 3 + 1], vertices[b * 3 + 2]],
        [vertices[a * 3 + 0], vertices[a * 3 + 1], vertices[a * 3 + 2]]
    );

    let edge2: Vec3 = subtract(
        [0, 0, 0],
        [vertices[c * 3 + 0], vertices[c * 3 + 1], vertices[c * 3 + 2]],
        [vertices[b * 3 + 0], vertices[b * 3 + 1], vertices[b * 3 + 2]]
    );

    let prodcut = cross([0, 0, 0], edge2, edge1);
    return normalize(prodcut, prodcut);
}
