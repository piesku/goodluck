/**
 * @module systems/sys_camera
 */

import {copy, get_translation, multiply} from "../../common/mat4.js";
import {ProjectionKind, resize_ortho, resize_perspective} from "../../common/projection.js";
import {Entity} from "../../common/world.js";
import {Camera, CameraKind, CameraXr} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    game.Cameras = [];

    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            game.Cameras.push(i);
            let camera = game.World.Camera[i];
            switch (camera.Kind) {
                case CameraKind.Xr:
                    throw new Error(
                        "XR camera is not part of core/. See WebXR/systems/sys_camera."
                    );
                default:
                    update_camera(game, i, camera);
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
