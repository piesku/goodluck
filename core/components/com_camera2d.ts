/**
 * # Camera2D
 *
 * The `Camera2D` component makes the rendering system render the scene from the
 * vantage point of the entity.
 */

import {mat2d_create} from "../../lib/mat2d.js";
import {Mat2D, Vec2} from "../../lib/math.js";
import {Projection2D} from "../../lib/projection2d.js";
import {vec2_transform_position} from "../../lib/vec2.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Camera2D {
    Projection: Projection2D;
    Pv: Mat2D;
    World: Mat2D;
    ViewportWidth: number;
    ViewportHeight: number;
}

/**
 * Add Camera2D to an entity.
 *
 * Camera2D always uses an orthographic projection. The projection is set up
 * with z-order +1 as the near plane and -1 as the far plane. Use render2d's
 * order() mixin to change the z-order.
 *
 * The radius of the projection specifies how much of the world is visible
 * min(horizontally, vertically), depending on the aspect ratio.  As a special
 * case, if the radius is [0, 0], sys_resize2d will dynamically resize the
 * projection to keep the unit size in pixels constant.
 *
 * @param radius The radius of the projection: [left, top].
 */
export function camera2d(radius: Vec2) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera2D;
        game.World.Camera2D[entity] = {
            Projection: {
                Radius: radius,
                Projection: [1 / radius[0], 0, 0, 1 / radius[1], 0, 0],
                Inverse: [radius[0], 0, 0, radius[1], 0, 0],
            },
            Pv: mat2d_create(),
            World: mat2d_create(),
            ViewportWidth: 0,
            ViewportHeight: 0,
        };
    };
}

/**
 * Transform a point on the screen (in pixel coords) into a point in the world's
 * 2D space (in world units).
 *
 * @param out The world-space position to write to.
 * @param camera The camera whose projection to unapply.
 * @param pos  The screen-space position to transform.
 */
export function viewport_to_world(out: Vec2, camera: Camera2D, pos: Vec2) {
    // Transform the position from viewport space to the NDC space (where +Y is up).
    out[0] = (pos[0] / camera.ViewportWidth) * 2 - 1;
    out[1] = -(pos[1] / camera.ViewportHeight) * 2 + 1;

    // ...then to the eye space...
    vec2_transform_position(out, out, camera.Projection.Inverse);

    // ...and then to the world space.
    vec2_transform_position(out, out, camera.World);
}
