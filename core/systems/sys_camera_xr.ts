/**
 * @module systems/sys_camera_xr
 */

import {create, get_translation, invert, multiply} from "../../common/mat4.js";
import {Entity} from "../../common/world.js";
import {CameraKind, CameraXr, XrEye} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera_xr(game: Game, delta: number) {
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
            View: create(),
            Pv: create(),
            Position: [0, 0, 0],
            FogColor: camera.ClearColor,
            FogDistance: game.XrSession?.renderState.depthFar ?? 0,
        };

        // Compute the eye's world matrix.
        multiply(eye.View, transform.World, viewpoint.transform.matrix);
        get_translation(eye.Position, eye.View);

        // Compute the view matrix.
        invert(eye.View, eye.View);
        // Compute the PV matrix.
        multiply(eye.Pv, viewpoint.projectionMatrix, eye.View);

        camera.Eyes.push(eye);
    }
}
