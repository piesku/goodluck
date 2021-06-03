import {AABB} from "./aabb.js";
import {Vec3} from "./math.js";
import {Mesh} from "./mesh";
import {add, cross, dot, scale, subtract} from "./vec3.js";

export interface RaycastHit {
    Collider: AABB;
    Point: Vec3;
    TriIndex?: number;
}

export function ray_intersect_aabb(
    colliders: Array<AABB>,
    origin: Vec3,
    direction: Vec3
): RaycastHit | null {
    let nearest_t = Infinity;
    let nearest_i = null;
    for (let i = 0; i < colliders.length; i++) {
        let t = intersection_time(origin, direction, colliders[i]);
        if (0 < t && t < nearest_t) {
            // Find the smallest positive t.
            nearest_t = t;
            nearest_i = i;
        }
    }

    if (nearest_i !== null) {
        let intersection: Vec3 = [0, 0, 0];
        scale(intersection, direction, nearest_t);
        add(intersection, intersection, origin);
        return {Collider: colliders[nearest_i], Point: intersection};
    }

    return null;
}

function intersection_time(origin: Vec3, direction: Vec3, aabb: AABB) {
    let max_lo = -Infinity;
    let min_hi = +Infinity;

    for (let i = 0; i < 3; i++) {
        let lo = (aabb.Min[i] - origin[i]) / direction[i];
        let hi = (aabb.Max[i] - origin[i]) / direction[i];

        if (lo > hi) {
            [lo, hi] = [hi, lo];
        }

        if (hi < max_lo || lo > min_hi) {
            return Infinity;
        }

        if (lo > max_lo) max_lo = lo;
        if (hi < min_hi) min_hi = hi;
    }

    return max_lo > min_hi ? Infinity : max_lo;
}

export interface RaycastTri {
    TriIndex: number;
    Point: Vec3;
}

let K: Vec3 = [0, 0, 0];
let L: Vec3 = [0, 0, 0];
let M: Vec3 = [0, 0, 0];
let E: Vec3 = [0, 0, 0];
let F: Vec3 = [0, 0, 0];
let G: Vec3 = [0, 0, 0];
let N: Vec3 = [0, 0, 0];

// Based on https://www.codeproject.com/Articles/625787/Pick-Selection-with-OpenGL-and-OpenCL
export function ray_intersect_mesh(mesh: Mesh, origin: Vec3, direction: Vec3): RaycastTri | null {
    let tri_count = mesh.IndexCount / 3;

    for (let tri = 0; tri < tri_count; tri++) {
        let i1 = mesh.IndexArray[tri * 3 + 0] * 3;
        let i2 = mesh.IndexArray[tri * 3 + 1] * 3;
        let i3 = mesh.IndexArray[tri * 3 + 2] * 3;

        K[0] = mesh.VertexArray[i1 + 0];
        K[1] = mesh.VertexArray[i1 + 1];
        K[2] = mesh.VertexArray[i1 + 2];

        L[0] = mesh.VertexArray[i2 + 0];
        L[1] = mesh.VertexArray[i2 + 1];
        L[2] = mesh.VertexArray[i2 + 2];

        M[0] = mesh.VertexArray[i3 + 0];
        M[1] = mesh.VertexArray[i3 + 1];
        M[2] = mesh.VertexArray[i3 + 2];

        // O + tD = kK + lL + mM
        // O + tD = kK + lL + (1 - k - l)M
        // O + tD = kK + lL + M - kM - lM
        // O + tD = k(K - M) + l(L - M) + M
        // O - M = k(K - M) + l(L - M) - tD
        // G = kE + lF - tD

        // Two edges of the tri: E, F.
        subtract(E, K, M);
        subtract(F, L, M);

        // The third "edge" between M and the ray's origin: G.
        subtract(G, origin, M);

        // From now on, M is used as a temporary Vec3.

        // Given the linear system of equations:
        //     kE + lF - tD = G
        // Given the Cramer's Rule for solving the system using determinants:
        //     k = |G F -D| / |E F -D|
        //     l = |E G -D| / |E F -D|
        //     t = |E F  G| / |E F -D|
        // Given the determinant as the triple product:
        //     |A B C| = A·(B×C) = B·(C×A) = C·(A×B)
        // Given that we can invert the sign by switching the order of the cross product:
        //     |A B C| = A·(B×C) = -A·(C×B)
        // We arrive at:
        //     k = D·(F×G) / D·(F×E)
        //     l = D·(G×E) / D·(F×E)
        //     t = G·(E×F) / D·(F×E)

        cross(N, F, E);
        let denominator = dot(direction, N);
        if (denominator >= 0) {
            // The tri's normal and the ray's direction are too similar.
            // The ray would intersect the tri from the back side.
            continue;
        }

        // k = D·(F×G) / D·(F×G). Don't divide by D·(F×G) to save cycles, and
        // flip the comparison to emulate the negative denomiator.
        let k = dot(direction, cross(M, F, G));
        if (k > 0) {
            // Barycentric coordinate < 0, no intersection.
            continue;
        }

        // l = D·(G×E) / D·(F×G). Don't divide by D·(F×G) to save cycles, and
        // flip the comparison to emulate the negative denomiator.
        let l = dot(direction, cross(M, G, E));
        if (l > 0) {
            // Barycentric coordinate < 0, no intersection.
            continue;
        }

        // m = 1 - k - l when k and l are divided by the denominator.
        let m = denominator - k - l;
        if (m > 0) {
            // Barycentric coordinate < 0, no intersection.
            continue;
        }

        // t = G·(E×F) / D·(F×G)
        // G·(E×F) = -G·(F×E) = -G·N
        let t = -dot(G, N) / denominator;

        // Intersection is O + tD.
        let intersection: Vec3 = [0, 0, 0];
        scale(intersection, direction, t);
        add(intersection, intersection, origin);
        return {TriIndex: tri, Point: intersection};
    }

    return null;
}
