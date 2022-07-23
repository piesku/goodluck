/**
 * @module systems/sys_resize2d
 */

import {ProjectionKind, resize_ortho_constant} from "../../common/projection.js";
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

        for (let i = 0; i < game.World.Signature.length; i++) {
            if ((game.World.Signature[i] & QUERY) === QUERY) {
                let camera = game.World.Camera[i];
                if (
                    camera.Kind == CameraKind.Canvas &&
                    camera.Projection.Kind == ProjectionKind.Orthographic
                ) {
                    camera.Projection.Radius = game.ViewportHeight / UNIT_PX / 2;
                    let aspect = game.ViewportWidth / game.ViewportHeight;
                    resize_ortho_constant(camera.Projection, aspect);
                    break;
                }
            }
        }
    }
}
