import {multiply, perspective} from "../../common/mat4.js";
import {CameraKind, CameraPerspective, CameraVr, Eye} from "../components/com_camera.js";
import {Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    game.Cameras = [];

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

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let camera = game.World.Camera[entity];

    if (camera.Kind === CameraKind.Vr && game.VrDisplay?.isPresenting) {
        update_vr(game, entity, camera);
    } else if (camera.Kind === CameraKind.Perspective && !game.VrDisplay?.isPresenting) {
        update_perspective(game, entity, camera);
    }
}

function update_perspective(game: Game, entity: Entity, camera: CameraPerspective) {
    let transform = game.World.Transform[entity];
    game.Cameras.push(camera);

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

function update_vr(game: Game, entity: Entity, camera: CameraVr) {
    let transform = game.World.Transform[entity];
    game.Cameras.push(camera);

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

    // Compute PV as:
    //     PV = P * V
    //     PV = P * We^
    //     PV = P * (Wc * Le)^
    //     PV = P * Le^ * Wc^
    //     PV = P * {left,right}ViewMatrix * Sc

    // Or, using multiply()'s two-operand multiplication:
    //     PV = P * {left,right}ViewMatrix
    //     PV = PV * Sc

    let frame = game.VrFrameData!;
    if (camera.Eye === Eye.Left) {
        multiply(camera.PV, frame.leftProjectionMatrix, frame.leftViewMatrix);
        multiply(camera.PV, camera.PV, transform.Self);
    } else {
        multiply(camera.PV, frame.rightProjectionMatrix, frame.rightViewMatrix);
        multiply(camera.PV, camera.PV, transform.Self);
    }
}
