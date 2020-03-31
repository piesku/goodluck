import {get_translation} from "../../common/mat4.js";
import {Mesh} from "../../common/material.js";
import {Vec3} from "../../common/math.js";
import {
    add,
    cross,
    dot,
    normalize,
    scale,
    subtract,
    transform_direction,
    transform_point,
} from "../../common/vec3.js";
import {Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Transform | Has.Camera | Has.Pick;
const TARGET = Has.Transform | Has.Pickable;

export function sys_pick(game: Game, delta: number) {
    if (game.InputDelta.Mouse0 !== 1) {
        return;
    }

    let pickables: Array<Entity> = [];
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & TARGET) == TARGET) {
            pickables.push(i);
        }
    }

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) == QUERY) {
            update(game, i, pickables);
        }
    }
}

function update(game: Game, entity: Entity, pickables: Array<Entity>) {
    let transform = game.World.Transform[entity];
    let camera = game.World.Camera[entity];

    let x = (game.InputState.MouseX / game.ViewportWidth) * 2 - 1;
    // In the browser, +Y is down. Invert it, so that in NDC it's up.
    let y = -(game.InputState.MouseY / game.ViewportHeight) * 2 + 1;

    // The ray's origin is at the camera's world position.
    let origin = get_translation([0, 0, 0], transform.World);

    // The target is the point on the far plane where the mouse click happens;
    // first transform it to the eye space, and then to the world space.
    let target: Vec3 = [x, y, -1];
    transform_point(target, target, camera.Unproject);
    transform_point(target, target, transform.World);

    // The ray's direction.
    let direction: Vec3 = [0, 0, 0];
    subtract(direction, target, origin);
    normalize(direction, direction);

    // The ray in the pickable's self space.
    let origin_self: Vec3 = [0, 0, 0];
    let direction_self: Vec3 = [0, 0, 0];
    for (let p of pickables) {
        let transform = game.World.Transform[p];
        // Transform the ray to the pickable's space, which is cheaper than
        // transforming all vertices of the pickable to the world space.
        transform_point(origin_self, origin, transform.Self);
        transform_direction(direction_self, direction, transform.Self);
        let pickable = game.World.Pickable[p];
        let info = intersect_mesh(pickable.Mesh, origin, direction);
        if (info) {
            // Transform the intersection point back to tthe world space.
            transform_point(info.Point, info.Point, transform.World);
            console.log(info);
        }
    }
}

interface PickingResult {
    Tri: number;
    Point: Vec3;
}

// Based on https://www.codeproject.com/Articles/625787/Pick-Selection-with-OpenGL-and-OpenCL
function intersect_mesh(mesh: Mesh, origin: Vec3, direction: Vec3): PickingResult | null {
    let tri_count = mesh.IndexCount / 3;

    for (let tri = 0; tri < tri_count; tri++) {
        let i1 = mesh.IndexArray[tri * 3 + 0];
        let i2 = mesh.IndexArray[tri * 3 + 1];
        let i3 = mesh.IndexArray[tri * 3 + 2];

        let K: Vec3 = [
            mesh.VertexArray[i1 * 3 + 0],
            mesh.VertexArray[i1 * 3 + 1],
            mesh.VertexArray[i1 * 3 + 2],
        ];
        let L: Vec3 = [
            mesh.VertexArray[i2 * 3 + 0],
            mesh.VertexArray[i2 * 3 + 1],
            mesh.VertexArray[i2 * 3 + 2],
        ];
        let M: Vec3 = [
            mesh.VertexArray[i3 * 3 + 0],
            mesh.VertexArray[i3 * 3 + 1],
            mesh.VertexArray[i3 * 3 + 2],
        ];

        // O + tD = kK + lL + mM
        // O + tD = kK + lL + (1 - k - l)M
        // O + tD = kK + lL + M - kM - lM
        // O + tD = k(K - M) + l(L - M) + M
        // O - M = k(K - M) + l(L - M) - tD
        // G = kE + lF - tD

        // Two edges of the tri (to calculate the normal).
        let E: Vec3 = subtract([0, 0, 0], K, M);
        let F: Vec3 = subtract([0, 0, 0], L, M);

        // The third "edge" between M and the ray's origin.
        let G: Vec3 = subtract([0, 0, 0], origin, M);

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

        let normal = cross([0, 0, 0], F, E);
        let denominator = dot(direction, normal);
        if (denominator >= 0) {
            // The tri's normal and the ray's direction are too similar.
            // The ray would intersect the tri from the back side.
            continue;
        }

        // k = D·(F×G) / D·(F×G). Don't divide by D·(F×G) to save cycles, and
        // flip the comparison to emulate the negative denomiator.
        let k = dot(direction, cross([0, 0, 0], F, G));
        if (k > 0) {
            // Barycentric coordinate < 0, no intersection.
            continue;
        }

        // l = D·(G×E) / D·(F×G). Don't divide by D·(F×G) to save cycles, and
        // flip the comparison to emulate the negative denomiator.
        let l = dot(direction, cross([0, 0, 0], G, E));
        if (l > 0) {
            // Barycentric coordinate < 0, no intersection.
            continue;
        }

        // m = 1 - k - l when k and l are divided by thhe denominator.
        let m = denominator - k - l;
        if (m > 0) {
            // Barycentric coordinate < 0, no intersection.
            continue;
        }

        // t = G·(E×F) / D·(F×G)
        let t = dot(G, cross([0, 0, 0], E, F)) / denominator;
        let intersection = scale([0, 0, 0], direction, t);
        add(intersection, intersection, origin);
        return {Tri: tri, Point: intersection};
    }

    return null;
}
