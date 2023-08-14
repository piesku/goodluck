/**
 * # sys_resize
 *
 * Resize the inner resolution of canvases when the browser's window is resized,
 * resize render-to-texture targets, and update the projection matrices of
 * cameras in the scene.
 */

import {
    resize_deferred_target,
    resize_forward_target,
    resize_hdr_target,
    TargetKind,
} from "../../lib/framebuffer.js";
import {mat4_from_ortho, mat4_from_perspective, mat4_invert} from "../../lib/mat4.js";
import {Projection, ProjectionKind} from "../../lib/projection.js";
import {CameraKind} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Camera;

export function sys_resize(game: Game, delta: number) {
    if (game.ViewportWidth != window.innerWidth || game.ViewportHeight != window.innerHeight) {
        game.ViewportResized = true;
    }

    if (game.ViewportResized) {
        game.ViewportWidth =
            game.BackgroundCanvas.width =
            game.SceneCanvas.width =
            game.ForegroundCanvas.width =
                window.innerWidth;
        game.ViewportHeight =
            game.BackgroundCanvas.height =
            game.SceneCanvas.height =
            game.ForegroundCanvas.height =
                window.innerHeight;

        for (let target of Object.values(game.Targets)) {
            if (target.ResizeToViewport) {
                switch (target.Kind) {
                    case TargetKind.Forward:
                        resize_forward_target(
                            game.Gl,
                            target,
                            game.ViewportWidth,
                            game.ViewportHeight,
                        );
                        break;
                    case TargetKind.Hdr:
                        resize_hdr_target(game.Gl, target, game.ViewportWidth, game.ViewportHeight);
                        break;
                    case TargetKind.Deferred:
                        resize_deferred_target(
                            game.Gl,
                            target,
                            game.ViewportWidth,
                            game.ViewportHeight,
                        );
                        break;
                }
            }
        }

        for (let i = 0; i < game.World.Signature.length; i++) {
            if ((game.World.Signature[i] & QUERY) === QUERY) {
                let camera = game.World.Camera[i];
                switch (camera.Kind) {
                    case CameraKind.Canvas:
                        camera.ViewportWidth = game.ViewportWidth;
                        camera.ViewportHeight = game.ViewportHeight;
                        update_projection(
                            camera.Projection,
                            game.ViewportWidth / game.ViewportHeight,
                        );
                        break;
                    case CameraKind.Target:
                        camera.ViewportWidth = game.ViewportWidth;
                        camera.ViewportHeight = game.ViewportHeight;
                        update_projection(
                            camera.Projection,
                            camera.Target.Width / camera.Target.Height,
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
            if (aspect < 1) {
                // Portrait orientation.
                mat4_from_perspective(
                    projection.Projection,
                    projection.FovY / aspect,
                    aspect,
                    projection.Near,
                    projection.Far,
                );
            } else {
                // Landscape orientation.
                mat4_from_perspective(
                    projection.Projection,
                    projection.FovY,
                    aspect,
                    projection.Near,
                    projection.Far,
                );
            }
            break;
        }
        case ProjectionKind.Orthographic:
            let target_aspect = projection.Radius[0] / projection.Radius[1];
            if (aspect < target_aspect) {
                // Portrait orientation.
                mat4_from_ortho(
                    projection.Projection,
                    projection.Radius[0] / aspect,
                    projection.Radius[0],
                    -projection.Radius[0] / aspect,
                    -projection.Radius[0],
                    projection.Near,
                    projection.Far,
                );
            } else {
                // Landscape orientation.
                mat4_from_ortho(
                    projection.Projection,
                    projection.Radius[1],
                    projection.Radius[1] * aspect,
                    -projection.Radius[1],
                    -projection.Radius[1] * aspect,
                    projection.Near,
                    projection.Far,
                );
            }
            break;
    }

    mat4_invert(projection.Inverse, projection.Projection);
}
