/**
 * @module systems/sys_camera
 */

import {copy, get_translation, multiply} from "../../common/mat4.js";
import {CameraKind} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let camera = game.World.Camera[i];
            if (camera.Kind !== CameraKind.Forward) {
                throw new Error("Only Forward cameras are supported.");
            }

            let transform = game.World.Transform[i];
            let projection = camera.Projection;

            copy(camera.View, transform.Self);
            multiply(camera.Pv, projection.Projection, camera.View);
            get_translation(camera.Position, transform.World);

            game.Cameras.push(i);
        }
    }
}
