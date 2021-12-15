import {input_pointer_position} from "../../common/input.js";
import {get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {ray_intersect_aabb, ray_intersect_mesh} from "../../common/raycast.js";
import {normalize, subtract, transform_direction, transform_position} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
import {CameraKind} from "../components/com_camera.js";
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

function update(game: Game, entity: Entity, pickables: Array<Collide>) {
    let transform = game.World.Transform[entity];
    let camera = game.World.Camera[entity];
    if (camera.Kind === CameraKind.Xr) {
        throw new Error("XR not implemented");
    }

    let pointer_position = input_pointer_position(game);
    if (pointer_position === null) {
        // No mouse, no touch.
        return;
    }

    let x = (pointer_position[0] / game.ViewportWidth) * 2 - 1;
    // In the browser, +Y is down. Invert it, so that in NDC it's up.
    let y = -(pointer_position[1] / game.ViewportHeight) * 2 + 1;

    // The ray's origin is at the camera's world position.
    let origin = get_translation([0, 0, 0], transform.World);

    // The target is the point on the far plane where the mouse click happens;
    // first transform it to the eye space, and then to the world space.
    let target: Vec3 = [x, y, -1];
    transform_position(target, target, camera.Projection.Inverse);
    transform_position(target, target, transform.World);

    // The ray's direction.
    let direction: Vec3 = [0, 0, 0];
    subtract(direction, target, origin);
    normalize(direction, direction);

    let hit = ray_intersect_aabb(pickables, origin, direction);
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
                transform_position(origin_self, origin, transform.Self);
                transform_direction(direction_self, direction, transform.Self);

                let hit = ray_intersect_mesh(pickable.Mesh, origin, direction);
                if (hit) {
                    // Transform the intersection point back to the world space.
                    transform_position(hit.Point, hit.Point, transform.World);
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
