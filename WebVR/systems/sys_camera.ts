import {multiply, perspective} from "../../common/mat4.js";
import {CameraKind, CameraPerspective, CameraVr} from "../components/com_camera.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    if (game.VrDisplay?.isPresenting) {
        game.VrDisplay.getFrameData(game.VrFrameData!);
    } else if (
        game.ViewportWidth != window.innerWidth ||
        game.ViewportHeight != window.innerHeight
    ) {
        game.ViewportWidth = game.Canvas.width = window.innerWidth;
        game.ViewportHeight = game.Canvas.height = window.innerHeight;
        game.ViewportResized = true;
    }

    game.Camera = undefined;
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            let camera = game.World.Camera[i];

            if (camera.Kind === CameraKind.Vr && game.VrDisplay?.isPresenting) {
                update_vr(game, i, camera);

                // Support only one camera per scene;
                return;
            }

            if (camera.Kind !== CameraKind.Vr && !game.VrDisplay?.isPresenting) {
                update_perspective(game, i, camera);

                // Support only one camera per scene;
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
            perspective(camera.Projection, camera.FovY, aspect, camera.Near, camera.Far);
        } else {
            // Portrait orientation.
            perspective(camera.Projection, camera.FovY / aspect, aspect, camera.Near, camera.Far);
        }
    }

    multiply(camera.Pv, camera.Projection, transform.Self);
}

function update_vr(game: Game, entity: Entity, camera: CameraVr) {
    let transform = game.World.Transform[entity];
    game.Camera = camera;

    // Compute PV, where V is the inverse of eye's World (We) matrix, which is
    // unknown. Instead, we have frame.{left,right}ViewMatrix, which are eyes'
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
    //     {left,right}ViewMatrix == Le^

    // Compute left PV as:
    //     PV = P * V
    //     PV = P * We^
    //     PV = P * (Wc * Le)^
    //     PV = P * Le^ * Wc^
    //     PV = P * leftViewMatrix * Sc

    // Or, using multiply()'s two-operand multiplication:
    //     PV = P * leftViewMatrix
    //     PV = PV * Sc

    let frame = game.VrFrameData!;
    multiply(camera.PvLeft, frame.leftProjectionMatrix, frame.leftViewMatrix);
    multiply(camera.PvLeft, camera.PvLeft, transform.Self);
    multiply(camera.PvRight, frame.rightProjectionMatrix, frame.rightViewMatrix);
    multiply(camera.PvRight, camera.PvRight, transform.Self);
}
