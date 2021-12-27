/**
 * @module systems/sys_camera
 */

import {multiply} from "../../common/mat4.js";
import {CameraKind} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform2D | Has.Camera;

// The camera is hardcoded at z=2, with near=1 and far=3.
const CAMERA_Z = 2;

export function sys_camera2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let camera = game.World.Camera[i];
            if (camera.Kind !== CameraKind.Canvas) {
                throw new Error("Only canvas cameras are supported.");
            }

            let projection = camera.Projection;
            let transform2d = game.World.Transform2D[i];

            camera.View[0] = transform2d.Self[0];
            camera.View[1] = transform2d.Self[1];
            camera.View[4] = transform2d.Self[2];
            camera.View[5] = transform2d.Self[3];
            camera.View[12] = transform2d.Self[4];
            camera.View[13] = transform2d.Self[5];
            camera.View[14] = -CAMERA_Z;

            multiply(camera.Pv, projection.Projection, camera.View);
            camera.Position[0] = transform2d.World[4];
            camera.Position[1] = transform2d.World[5];
            camera.Position[2] = CAMERA_Z;

            game.Cameras.push(i);
        }
    }
}
