import {copy, create, get_translation, invert, multiply} from "../../common/mat4.js";
import {ProjectionKind, resize_perspective} from "../../common/projection.js";
import {Entity} from "../../common/world.js";
import {CameraForward, CameraKind, CameraXr, XrEye} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    game.Camera = undefined;
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let camera = game.World.Camera[i];

            if (camera.Kind === CameraKind.Xr && game.XrFrame) {
                update_xr(game, i, camera);

                // Support only one camera per scene.
                return;
            }

            if (camera.Kind === CameraKind.Forward && !game.XrFrame) {
                update_forward(game, i, camera);

                // Support only one camera per scene.
                return;
            }
        }
    }
}

function update_forward(game: Game, entity: Entity, camera: CameraForward) {
    game.Camera = entity;

    if (game.ViewportResized) {
        switch (camera.Projection.Kind) {
            case ProjectionKind.Perspective: {
                let aspect = game.ViewportWidth / game.ViewportHeight;
                resize_perspective(camera.Projection, aspect);
                break;
            }
        }
    }

    let transform = game.World.Transform[entity];
    copy(camera.View, transform.Self);
    multiply(camera.Pv, camera.Projection.Projection, camera.View);
    get_translation(camera.Position, transform.World);
}

function update_xr(game: Game, entity: Entity, camera: CameraXr) {
    game.Camera = entity;

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
