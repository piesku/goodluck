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
        transform_point(origin_self, origin, transform.Self);
        transform_direction(direction_self, direction, transform.Self);
        let pickable = game.World.Pickable[p];
        let info = intersect_mesh(pickable.Mesh, origin, direction);
        if (info) {
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

        let E: Vec3 = subtract([0, 0, 0], K, M);
        let F: Vec3 = subtract([0, 0, 0], L, M);
        let G: Vec3 = subtract([0, 0, 0], origin, M);

        let normal = cross([0, 0, 0], F, E);
        let denominator = dot(direction, normal);
        if (denominator >= 0) {
            continue;
        }

        let k = dot(direction, cross([0, 0, 0], F, G)) / denominator;
        if (k < 0) {
            continue;
        }

        let l = dot(direction, cross([0, 0, 0], G, E)) / denominator;
        if (l < 0) {
            continue;
        }

        let m = 1 - k - l;
        if (m < 0) {
            continue;
        }

        let t = dot(G, cross([0, 0, 0], E, F)) / denominator;
        //console.log({k, l, m, t, face});
        let intersection = scale([0, 0, 0], direction, t);
        add(intersection, intersection, origin);
        return {Tri: tri, Point: intersection};
    }

    return null;
}
