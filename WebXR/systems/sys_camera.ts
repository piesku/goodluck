import {copy, create, get_translation, invert, multiply, perspective} from "../../common/mat4.js";
import {CameraKind, CameraPerspective, CameraXr, XrEye} from "../components/com_camera.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    if (game.ViewportWidth != window.innerWidth || game.ViewportHeight != window.innerHeight) {
        game.ViewportWidth = game.Canvas.width = window.innerWidth;
        game.ViewportHeight = game.Canvas.height = window.innerHeight;
        game.ViewportResized = true;
    }

    game.Camera = undefined;
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let camera = game.World.Camera[i];

            if (camera.Kind === CameraKind.Xr && game.XrFrame) {
                update_vr(game, i, camera);

                // Support only one camera per scene.
                return;
            }

            if (camera.Kind !== CameraKind.Xr && !game.XrFrame) {
                update_perspective(game, i, camera);

                // Support only one camera per scene.
                return;
            }
        }
    }
}

function update_perspective(game: Game, entity: Entity, camera: CameraPerspective) {
    game.Camera = camera;

    if (game.ViewportResized) {
        let aspect = game.ViewportWidth / game.ViewportHeight;
        if (aspect > 1) {
            // Landscape orientation.
            perspective(camera.Projection, camera.FovY, aspect, camera.Near, camera.Far);
        } else {
            // Portrait orientation.
            perspective(camera.Projection, camera.FovY / aspect, aspect, camera.Near, camera.Far);
        }
    }

    let transform = game.World.Transform[entity];
    copy(camera.View, transform.Self);
    multiply(camera.Pv, camera.Projection, camera.View);
    get_translation(camera.Position, transform.World);
}

function update_vr(game: Game, entity: Entity, camera: CameraXr) {
    game.Camera = camera;

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
