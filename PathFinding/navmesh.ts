import {Mesh} from "../common/material.js";
import {Vec3} from "../common/math.js";
import {manhattan} from "../common/vec3.js";

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
        navmesh.Graph[face] = [];

        let v1 = mesh.IndexArray[face * 3 + 0];
        let v2 = mesh.IndexArray[face * 3 + 1];
        let v3 = mesh.IndexArray[face * 3 + 2];

        navmesh.Centroids[face] = [
            (mesh.VertexArray[v1 * 3 + 0] +
                mesh.VertexArray[v2 * 3 + 0] +
                mesh.VertexArray[v3 * 3 + 0]) /
                3,
            (mesh.VertexArray[v1 * 3 + 1] +
                mesh.VertexArray[v2 * 3 + 1] +
                mesh.VertexArray[v3 * 3 + 1]) /
                3,
            (mesh.VertexArray[v1 * 3 + 2] +
                mesh.VertexArray[v2 * 3 + 2] +
                mesh.VertexArray[v3 * 3 + 2]) /
                3,
        ];

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
                        manhattan(navmesh.Centroids[face], navmesh.Centroids[other]),
                    ]);
                    break;
                }
            }
        }
    }

    return navmesh;
}
