/**
 * @module systems/sys_camera
 */

import {copy, get_translation, multiply} from "../../common/mat4.js";
import {ProjectionKind, resize_ortho, resize_perspective} from "../../common/projection.js";
import {CameraKind} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    game.Cameras = [];
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let camera = game.World.Camera[i];
            let transform = game.World.Transform[i];
            let projection = camera.Projection;

            if (game.ViewportResized) {
                switch (projection.Kind) {
                    case ProjectionKind.Perspective: {
                        let aspect =
                            camera.Kind === CameraKind.Forward
                                ? game.ViewportWidth / game.ViewportHeight
                                : camera.Target.Width / camera.Target.Height;
                        resize_perspective(projection, aspect);
                        break;
                    }
                    case ProjectionKind.Ortho:
                        resize_ortho(projection);
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
