import {create, multiply, perspective} from "../../common/mat4.js";
import {CameraKind, CameraPerspective, CameraXr} from "../components/com_camera.js";
import {Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    if (game.ViewportWidth != window.innerWidth || game.ViewportHeight != window.innerHeight) {
        game.ViewportWidth = game.Canvas.width = window.innerWidth;
        game.ViewportHeight = game.Canvas.height = window.innerHeight;
        game.ViewportResized = true;
    }

    game.Camera = undefined;
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
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
    let transform = game.World.Transform[entity];
    game.Camera = camera;

    if (game.ViewportResized) {
        let aspect = game.ViewportWidth / game.ViewportHeight;
        if (aspect > 1) {
            // Landscape orientation.
            perspective(camera.Projection, camera.FOVy, aspect, camera.Near, camera.Far);
        } else {
            // Portrait orientation.
            perspective(camera.Projection, camera.FOVy / aspect, aspect, camera.Near, camera.Far);
        }
    }

    multiply(camera.PV, camera.Projection, transform.Self);
}

function update_vr(game: Game, entity: Entity, camera: CameraXr) {
    game.Camera = camera;
    camera.Views = [];

    let transform = game.World.Transform[entity];
    let layer = game.XrFrame!.session.renderState.baseLayer!;
    let pose = game.XrFrame!.getViewerPose(game.XrSpace);

    for (let view of pose.views) {
        let viewport = layer.getViewport(view);

        // Compute PV, where V is the inverse of eye's World (We) matrix, which is
        // unknown. Instead, we have view.transform.inverse.matrix, which are eyes'
        // inverted local matrices (Le), relative to the camera's transform's space,
        // and the camera entity's World and Self.

        // Definitions:
        //     M^ denotes an inverse of M.
        //     Le: eye's matrix in camera's space
        //     We: eye's matrix in world space
        //     Wc: camera's matrix in world space
        //     Sc: camera's self matrix (world -> camera space)

        // Given that:
        //     (AB)^ == B^ * A^
        //     view.transform.inverse.matrix == Le^

        // Compute PV as:
        //     PV = P * V
        //     PV = P * We^
        //     PV = P * (Wc * Le)^
        //     PV = P * Le^ * Wc^
        //     PV = P * view.transform.inverse.matrix * Sc

        // Or, using multiply()'s two-operand multiplication:
        //     PV = PV * view.transform.inverse.matrix
        //     PV = PV * Sc
        let pv = create();
        multiply(pv, view.projectionMatrix, view.transform.inverse.matrix);
        multiply(pv, pv, transform.Self);

        camera.Views.push({
            View: view,
            Viewport: viewport,
            Pv: pv,
        });
    }
}
