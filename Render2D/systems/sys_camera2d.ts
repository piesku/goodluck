/**
 * @module systems/sys_camera
 */

import {copy, get_translation, multiply} from "../../common/mat4.js";
import {ProjectionKind, resize_ortho_keeping_unit_size} from "../../common/projection.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera2d(game: Game, delta: number) {
    game.Cameras = [];
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let camera = game.World.Camera[i];
            let transform = game.World.Transform[i];
            let projection = camera.Projection;

            if (game.ViewportResized) {
                let aspect = game.ViewportWidth / game.ViewportHeight;
                switch (projection.Kind) {
                    case ProjectionKind.Ortho:
                        resize_ortho_keeping_unit_size(projection, aspect, game.ViewportHeight, 16);
                        break;
                }
            }

            copy(camera.View, transform.Self);
            multiply(camera.Pv, projection.Projection, camera.View);
            get_translation(camera.Position, transform.World);

            game.Cameras.push(i);
        }
    }
}
