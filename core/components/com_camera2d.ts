/**
 * @module components/com_camera2d
 */

import {create} from "../../common/mat2d.js";
import {Mat2D, Vec2} from "../../common/math.js";
import {Projection2D} from "../../common/projection2d.js";
import {transform_position} from "../../common/vec2.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Camera2D {
    Projection: Projection2D;
    Pv: Mat2D;
    World: Mat2D;
    ViewportWidth: number;
    ViewportHeight: number;
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
            ViewportWidth: 0,
            ViewportHeight: 0,
        };
    };
}

export function viewport_to_world(out: Vec2, camera: Camera2D, pos: Vec2) {
    // Transform the position from viewport space to the NDC space (where +Y is up).
    out[0] = (pos[0] / camera.ViewportWidth) * 2 - 1;
    out[1] = -(pos[1] / camera.ViewportHeight) * 2 + 1;

    // ...then to the eye space...
    transform_position(out, out, camera.Projection.Inverse);

    // ...and then to the world space.
    transform_position(out, out, camera.World);
}
