/**
 * @module systems/sys_camera
 */

import {copy, create, get_translation, invert, multiply} from "../../common/mat4.js";
import {ProjectionKind, resize_ortho, resize_perspective} from "../../common/projection.js";
import {Entity} from "../../common/world.js";
import {Camera, CameraKind, CameraXr, XrEye} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    game.Cameras = [];

    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let camera = game.World.Camera[i];
            switch (camera.Kind) {
                case CameraKind.Xr:
                    if (game.XrFrame) {
                        update_xr(game, i, camera);
                        game.Cameras.push(i);
                    }
                    break;
                case CameraKind.Forward:
                    if (!game.XrFrame) {
                        update_camera(game, i, camera);
                        game.Cameras.push(i);
                    }
                    break;
                default:
                    update_camera(game, i, camera);
                    game.Cameras.push(i);
                    break;
            }
        }
    }
}

function update_camera(game: Game, entity: Entity, camera: Exclude<Camera, CameraXr>) {
    let transform = game.World.Transform[entity];
    let projection = camera.Projection;

    if (game.ViewportResized) {
        let aspect =
            camera.Kind === CameraKind.Forward
                ? game.ViewportWidth / game.ViewportHeight
                : camera.Target.Width / camera.Target.Height;
        switch (projection.Kind) {
            case ProjectionKind.Perspective: {
                resize_perspective(projection, aspect);
                break;
            }
            case ProjectionKind.Ortho:
                resize_ortho(projection, aspect);
                break;
        }
    }

    copy(camera.View, transform.Self);
    multiply(camera.Pv, projection.Projection, camera.View);
    get_translation(camera.Position, transform.World);
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
