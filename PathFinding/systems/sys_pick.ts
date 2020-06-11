import {get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {ray_intersect_aabb, ray_intersect_mesh} from "../../common/raycast.js";
import {normalize, subtract, transform_direction, transform_point} from "../../common/vec3.js";
import {Collide} from "../components/com_collide.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera | Has.Pick;
const TARGET = Has.Transform | Has.Collide | Has.Pickable;

export function sys_pick(game: Game, delta: number) {
    game.Pick = undefined;

    let pickables: Array<Collide> = [];
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & TARGET) == TARGET) {
            pickables.push(game.World.Collide[i]);
        }
    }

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) == QUERY) {
            update(game, i, pickables);
        }
    }
}

function update(game: Game, entity: Entity, pickables: Array<Collide>) {
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

    let hit = ray_intersect_aabb(pickables, origin, direction);
    if (hit) {
        let collider = hit.Collider as Collide;
        let entity = collider.Entity;

        game.Pick = {
            Entity: entity,
            Collider: collider,
            Point: hit.Point,
        };

        let pickable = game.World.Pickable[entity];
        if (pickable.Mesh) {
            // The ray in the pickable's self space.
            let origin_self: Vec3 = [0, 0, 0];
            let direction_self: Vec3 = [0, 0, 0];

            let transform = game.World.Transform[entity];
            // Transform the ray to the pickable's space, which is cheaper than
            // transforming all vertices of the pickable to the world space.
            transform_point(origin_self, origin, transform.Self);
            transform_direction(direction_self, direction, transform.Self);

            let hit = ray_intersect_mesh(pickable.Mesh, origin, direction);
            if (hit) {
                // Transform the intersection point back to the world space.
                transform_point(hit.Point, hit.Point, transform.World);
                game.Pick.Point = hit.Point;
                game.Pick.TriIndex = hit.TriIndex;
                return;
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
