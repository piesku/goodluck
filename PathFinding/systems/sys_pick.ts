import {pointer_viewport} from "../../lib/input.js";
import {mat4_get_translation} from "../../lib/mat4.js";
import {Vec2, Vec3} from "../../lib/math.js";
import {ray_intersect_aabb, ray_intersect_mesh} from "../../lib/raycast.js";
import {
    vec3_normalize,
    vec3_subtract,
    vec3_transform_direction,
    vec3_transform_position,
} from "../../lib/vec3.js";
import {Entity} from "../../lib/world.js";
import {CameraKind, viewport_to_world} from "../components/com_camera.js";
import {Collide} from "../components/com_collide.js";
import {PickableKind} from "../components/com_pickable.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const PICKABLES_QUERY = Has.Transform | Has.Collide | Has.Pickable;

export function sys_pick(game: Game, delta: number) {
    let pickables: Array<Collide> = [];
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & PICKABLES_QUERY) == PICKABLES_QUERY) {
            pickables.push(game.World.Collide[i]);
        }
    }

    game.Picked = undefined;
    if (game.Cameras.length > 0) {
        update(game, game.Cameras[0], pickables);
    }
}

let pointer_position: Vec2 = [0, 0];
let pointer_origin: Vec3 = [0, 0, 0];
// The target is the point on the far plane where the mouse click happens.
let pointer_target: Vec3 = [0, 0, 0];
let pointer_direction: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity, pickables: Array<Collide>) {
    let camera = game.World.Camera[entity];
    if (camera.Kind === CameraKind.Xr) {
        throw new Error("XR not implemented");
    }

    if (!pointer_viewport(game, pointer_position)) {
        // No mouse, no touch.
        return;
    }

    // The ray's origin is at the camera's world position.
    mat4_get_translation(pointer_origin, camera.World);

    // The pointer target in the world space.
    viewport_to_world(pointer_target, camera, pointer_position);

    // The ray's direction.
    vec3_subtract(pointer_direction, pointer_target, pointer_origin);
    vec3_normalize(pointer_direction, pointer_direction);

    let hit = ray_intersect_aabb(pickables, pointer_origin, pointer_direction);
    if (hit) {
        let collider = hit.Collider as Collide;
        let entity = collider.EntityId;

        let pickable = game.World.Pickable[entity];
        switch (pickable.Kind) {
            case PickableKind.AABB: {
                game.Picked = {
                    Entity: entity,
                    Collider: collider,
                    Point: hit.Point,
                };
                break;
            }
            case PickableKind.Mesh: {
                // The ray in the pickable's self space.
                let origin_self: Vec3 = [0, 0, 0];
                let direction_self: Vec3 = [0, 0, 0];

                let transform = game.World.Transform[entity];
                // Transform the ray to the pickable's space, which is cheaper than
                // transforming all vertices of the pickable to the world space.
                vec3_transform_position(origin_self, pointer_origin, transform.Self);
                vec3_transform_direction(direction_self, pointer_direction, transform.Self);

                let hit = ray_intersect_mesh(pickable.Mesh, origin_self, direction_self);
                if (hit) {
                    // Transform the intersection point back to the world space.
                    vec3_transform_position(hit.Point, hit.Point, transform.World);
                    game.Picked = {
                        Entity: entity,
                        Collider: collider,
                        Point: hit.Point,
                        TriIndex: hit.TriIndex,
                    };
                    return;
                }
            }
        }
    }
}

export interface Picked {
    Entity: Entity;
    Collider: Collide;
    Point: Vec3;
    TriIndex?: number;
}
