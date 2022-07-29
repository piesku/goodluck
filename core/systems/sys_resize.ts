/**
 * @module systems/sys_resize
 */

import {
    resize_deferred_target,
    resize_forward_target,
    resize_hdr_target,
    TargetKind,
} from "../../common/framebuffer.js";
import {from_ortho, from_perspective, invert} from "../../common/mat4.js";
import {Projection, ProjectionKind} from "../../common/projection.js";
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

        for (let target of Object.values(game.Targets)) {
            if (target.ResizeToViewport) {
                switch (target.Kind) {
                    case TargetKind.Forward:
                        resize_forward_target(
                            game.Gl,
                            target,
                            game.ViewportWidth,
                            game.ViewportHeight
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
                            game.ViewportHeight
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
                        update_projection(
                            camera.Projection,
                            game.ViewportWidth / game.ViewportHeight
                        );
                        break;
                    case CameraKind.Target:
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
            if (aspect < 1) {
                // Portrait orientation.
                from_perspective(
                    projection.Projection,
                    projection.FovY / aspect,
                    aspect,
                    projection.Near,
                    projection.Far
                );
            } else {
                // Landscape orientation.
                from_perspective(
                    projection.Projection,
                    projection.FovY,
                    aspect,
                    projection.Near,
                    projection.Far
                );
            }
            break;
        }
        case ProjectionKind.Orthographic:
            let target_aspect = projection.Radius[0] / projection.Radius[1];
            if (aspect < target_aspect) {
                // Portrait orientation.
                from_ortho(
                    projection.Projection,
                    projection.Radius[0] / aspect,
                    projection.Radius[0],
                    -projection.Radius[0] / aspect,
                    -projection.Radius[0],
                    projection.Near,
                    projection.Far
                );
            } else {
                // Landscape orientation.
                from_ortho(
                    projection.Projection,
                    projection.Radius[1],
                    projection.Radius[1] * aspect,
                    -projection.Radius[1],
                    -projection.Radius[1] * aspect,
                    projection.Near,
                    projection.Far
                );
            }
            break;
    }

    invert(projection.Inverse, projection.Projection);
}
