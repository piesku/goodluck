import {Vec3} from "./math.js";
import {face_centroid, face_normal, face_vertices, Mesh} from "./mesh.js";
import {distance_squared, dot} from "./vec3.js";

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

    let face: Vec3 = [0, 0, 0];
    let norm: Vec3 = [0, 0, 0];

    // Prepare data for graph building.
    for (let f = 0; f < face_count; f++) {
        face_vertices(face, mesh, f);

        face_normal(norm, mesh, face);
        if (Math.acos(dot(norm, UP)) > max_slope) {
            // Skip this face, it's not horizontal enough.
            continue;
        }

        // Initialize an empty adjacency list for the face.
        navmesh.Graph[f] = [];
        // Compute the centroid of the face from its vertices.
        navmesh.Centroids[f] = face_centroid([0, 0, 0], mesh, face);

        // Record the face as containing each of its vertices. This is used to
        // find the neighbors of a face given its vertices.
        for (let vert of face) {
            if (faces_containing_vertex[vert]) {
                faces_containing_vertex[vert].push(f);
            } else {
                faces_containing_vertex[vert] = [f];
            }
        }
    }

    // Build the graph.
    for (let f = 0; f < face_count; f++) {
        if (navmesh.Graph[f] === undefined) {
            // It's a skipped face, too sloped.
            continue;
        }

        face_vertices(face, mesh, f);
        let edges = [
            [face[0], face[1]],
            [face[1], face[2]],
            [face[2], face[0]],
        ];

        for (let [a, b] of edges) {
            // For every of the three edges of the face, check if any of the
            // other faces containing the first vertex of the edge also contains
            // the second one. If so, the faces are adjacent.
            for (let other of faces_containing_vertex[a]) {
                face_vertices(face, mesh, other);
                if (other !== f && (face[0] === b || face[1] === b || face[2] === b)) {
                    // Add `other` to the `face`'s adjacency list.
                    navmesh.Graph[f].push([
                        other,
                        distance_squared(navmesh.Centroids[f], navmesh.Centroids[other]),
                    ]);
                    break;
                }
            }
        }
    }

    return navmesh;
}
