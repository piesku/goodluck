/**
 * @module components/com_camera2d
 */

import {create, transform_point} from "../../common/mat2d.js";
import {Mat2D, Vec2} from "../../common/math.js";
import {Projection2D} from "../../common/projection2d.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Camera2D {
    Projection: Projection2D;
    Pv: Mat2D;
    World: Mat2D;
    ViewportSize: Vec2;
}

export function camera2d(radius: Vec2) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera2D;
        game.World.Camera2D[entity] = {
            Projection: {
                Radius: radius,
                Projection: [1 / radius[0], 0, 0, 1 / radius[1], 0, 0],
                Inverse: [radius[0], 0, 0, radius[1], 0, 0],
            },
            Pv: create(),
            World: create(),
            ViewportSize: [0, 0],
        };
    };
}

export function viewport_to_world(out: Vec2, camera: Camera2D, pos: Vec2) {
    // Transform the position from viewport space to NDC space (where +Y is up).
    out[0] = (pos[0] / camera.ViewportSize[0]) * 2 - 1;
    out[1] = -(pos[1] / camera.ViewportSize[1]) * 2 + 1;

    // ...then the eye space...
    transform_point(out, out, camera.Projection.Inverse);

    // ...and then to the world space.
    transform_point(out, out, camera.World);
}
