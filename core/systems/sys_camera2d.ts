/**
 * @module systems/sys_camera
 */

import {multiply} from "../../common/mat4.js";
import {CameraKind} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.NodeTransform2D | Has.Camera;

// The camera is hardcoded at z=2, with near=1 and far=3.
const CAMERA_Z = 2;

export function sys_camera2d(game: Game, delta: number) {
    game.Cameras = [];

    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let camera = game.World.Camera[ent];
            if (camera.Kind !== CameraKind.Canvas) {
                throw new Error("Only canvas cameras are supported.");
            }

            let projection = camera.Projection;
            let camera_node = game.World.NodeTransform2D[ent];

            camera.View[0] = camera_node.Self[0];
            camera.View[1] = camera_node.Self[1];
            camera.View[4] = camera_node.Self[2];
            camera.View[5] = camera_node.Self[3];
            camera.View[12] = camera_node.Self[4];
            camera.View[13] = camera_node.Self[5];
            camera.View[14] = -CAMERA_Z;

            multiply(camera.Pv, projection.Projection, camera.View);
            camera.Position[0] = camera_node.World[4];
            camera.Position[1] = camera_node.World[5];
            camera.Position[2] = CAMERA_Z;

            game.Cameras.push(ent);
        }
    }
}
