import {Mesh} from "../common/material.js";
import {Vec3} from "../common/math.js";
import {cross, distance_squared, dot, normalize, subtract} from "../common/vec3.js";

export interface NavMesh {
    Graph: Array<Array<[number, number]>>;
    Centroids: Array<Vec3>;
}

const UP: Vec3 = [0, 1, 0];

/**
 * Build a path finding node graph from a mesh.
 *
 * The mesh should be a regular Mesh object, which means it can also be
 * rendered. The faces of the mesh are described in two arrays: the
 * `VertexArray` stores a flat list of triplets corresponding to the (x, y, z)
 * coordinates of a vertex. The `IndexArray` stores a flat list of triplets
 * corresponding to (v1, v2, v3) vertex indices making up a face (a tri).
 *
 * The coordinates of the vertices will be used to compute face centroids. The
 * centroids are then used directly as waypoints in `sys_nav`. The centroids
 * (and thus, the nav mesh) should be defined in the world space, unscaled.
 *
 * @param mesh - The Mesh to build the node graph from.
 * @param max_slope - The maximum slope of faces considered as walkable.
 */
export function nav_bake(mesh: Mesh, max_slope: number) {
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
        if (Math.acos(dot(norm, UP)) > max_slope) {
            // Skip this face, it's not horizontal enough.
            continue;
        }

        // Initialize an empty adjacency list for the face.
        navmesh.Graph[face] = [];
        // Compute the centroid of the face from its vertices.
        navmesh.Centroids[face] = centroid(mesh.VertexArray, v1, v2, v3);

        // Record the face as containing each of its vertices. This is used to
        // find the neighbors of a face given its vertices.
        for (let vert of [v1, v2, v3]) {
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
            // It's a skipped face, too sloped.
            continue;
        }

        let v1 = mesh.IndexArray[face * 3 + 0];
        let v2 = mesh.IndexArray[face * 3 + 1];
        let v3 = mesh.IndexArray[face * 3 + 2];

        let edges = [
            [v1, v2],
            [v2, v3],
            [v3, v1],
        ];

        for (let [a, b] of edges) {
            // For every of the three edges of the face, check if any of the
            // other faces containing the first vertex of the edge also contains
            // the second one. If so, the faces are adjacent.
            for (let other of faces_containing_vertex[a]) {
                let o1 = mesh.IndexArray[other * 3 + 0];
                let o2 = mesh.IndexArray[other * 3 + 1];
                let o3 = mesh.IndexArray[other * 3 + 2];
                if (other !== face && (o1 === b || o2 === b || o3 === b)) {
                    // Add `other` to the `face`'s adjacency list.
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

let edge1: Vec3 = [0, 0, 0];
let edge2: Vec3 = [0, 0, 0];

function normal(vertices: Float32Array, a: number, b: number, c: number): Vec3 {
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
