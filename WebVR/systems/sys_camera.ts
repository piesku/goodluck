import {invert, multiply, perspective} from "../../common/mat4.js";
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
        update_vr(game, camera);
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

    invert(camera.View, transform.World);
    multiply(camera.PV, camera.Projection, camera.View);
}

function update_vr(game: Game, camera: CameraVr) {
    game.Cameras.push(camera);

    if (camera.Eye === Eye.Left) {
        multiply(
            camera.PV,
            game.VrFrameData!.leftProjectionMatrix,
            game.VrFrameData!.leftViewMatrix
        );
    } else {
        multiply(
            camera.PV,
            game.VrFrameData!.rightProjectionMatrix,
            game.VrFrameData!.rightViewMatrix
        );
    }
}
