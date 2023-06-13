/**
 * # sys_camera_xr
 *
 * Update the `PV` matrix of the WebXR [camera](com_camera.html).
 */

import {mat4_create, mat4_get_translation, mat4_invert, mat4_multiply} from "../../lib/mat4.js";
import {Entity} from "../../lib/world.js";
import {CameraKind, CameraXr, XrEye} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera_xr(game: Game, delta: number) {
    game.Cameras = [];

    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let camera = game.World.Camera[i];
            switch (camera.Kind) {
                case CameraKind.Xr:
                    update_xr(game, i, camera);
                    game.Cameras.push(i);
                    break;
            }
        }
    }
}

function update_xr(game: Game, entity: Entity, camera: CameraXr) {
    let transform = game.World.Transform[entity];
    let pose = game.XrFrame!.getViewerPose(game.XrSpace);

    camera.Eyes = [];
    for (let viewpoint of pose.views) {
        let eye: XrEye = {
            Viewpoint: viewpoint,
            Pv: mat4_create(),
            Position: [0, 0, 0],
            FogColor: camera.ClearColor,
            FogDistance: game.XrSession?.renderState.depthFar ?? 0,
        };

        // Compute the eye's world matrix.
        mat4_multiply(eye.Pv /* world */, transform.World, viewpoint.transform.matrix);
        mat4_get_translation(eye.Position, eye.Pv /* world */);

        // Compute the view matrix.
        mat4_invert(eye.Pv /* view */, eye.Pv /* world */);
        // Compute the PV matrix.
        mat4_multiply(eye.Pv, viewpoint.projectionMatrix, eye.Pv /* view */);

        camera.Eyes.push(eye);
    }
}
