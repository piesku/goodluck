/**
 * @module systems/sys_resize2d
 */

import {ProjectionKind, resize_ortho, resize_ortho_constant} from "../../common/projection.js";
import {CameraKind} from "../components/com_camera.js";
import {Game, UNIT_PX} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Camera;

export function sys_resize2d(game: Game, delta: number) {
    if (game.ViewportWidth != window.innerWidth || game.ViewportHeight != window.innerHeight) {
        game.ViewportResized = true;
    }

    if (game.ViewportResized) {
        game.ViewportWidth = game.Canvas3D.width = game.Canvas2D.width = window.innerWidth;
        game.ViewportHeight = game.Canvas3D.height = game.Canvas2D.height = window.innerHeight;

        for (let ent = 0; ent < game.World.Signature.length; ent++) {
            if ((game.World.Signature[ent] & QUERY) === QUERY) {
                let camera = game.World.Camera[ent];
                if (
                    camera.Kind == CameraKind.Canvas &&
                    camera.Projection.Kind == ProjectionKind.Orthographic
                ) {
                    let aspect = game.ViewportWidth / game.ViewportHeight;
                    if (camera.Projection.Radius[0] === 0 && camera.Projection.Radius[1] === 0) {
                        // A special case for projections which dynamically
                        // resize to keep the unit size in pixels constant.
                        let radius = game.ViewportHeight / UNIT_PX / 2;
                        resize_ortho_constant(camera.Projection, radius, aspect);
                    } else {
                        resize_ortho(camera.Projection, aspect);
                    }
                    break;
                }
            }
        }
    }
}
