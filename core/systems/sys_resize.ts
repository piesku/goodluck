/**
 * @module systems/sys_resize
 */

import {resize_deferred_target} from "../../common/framebuffer.js";
import {
    Projection,
    ProjectionKind,
    resize_ortho,
    resize_perspective,
} from "../../common/projection.js";
import {CameraKind} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Camera;

export function sys_resize(game: Game, delta: number) {
    if (game.ViewportWidth != window.innerWidth || game.ViewportHeight != window.innerHeight) {
        game.ViewportResized = true;
    }

    if (game.ViewportResized) {
        game.ViewportWidth = game.Canvas3D.width = game.Canvas2D.width = window.innerWidth;
        game.ViewportHeight = game.Canvas3D.height = game.Canvas2D.height = window.innerHeight;

        for (let i = 0; i < game.World.Signature.length; i++) {
            if ((game.World.Signature[i] & QUERY) === QUERY) {
                let camera = game.World.Camera[i];
                switch (camera.Kind) {
                    case CameraKind.Canvas:
                        update_projection(
                            camera.Projection,
                            game.ViewportWidth / game.ViewportHeight
                        );
                        break;
                    case CameraKind.Framebuffer:
                    case CameraKind.Depth:
                        update_projection(
                            camera.Projection,
                            camera.Target.Width / camera.Target.Height
                        );
                        break;
                    case CameraKind.Deferred:
                        resize_deferred_target(
                            game.Gl,
                            camera.Target,
                            game.ViewportWidth,
                            game.ViewportHeight
                        );
                        update_projection(
                            camera.Projection,
                            camera.Target.Width / camera.Target.Height
                        );
                        break;
                    case CameraKind.Xr:
                        // The eye projections are managed by the WebXR API.
                        break;
                }
            }
        }
    }
}

function update_projection(projection: Projection, aspect: number) {
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
