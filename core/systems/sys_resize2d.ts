/**
 * # sys_resize2d
 *
 * Resize the inner resolution of canvases when the browser's window is resized,
 * and update the projection matrices of cameras in the scene.
 */

import {mat2d_from_ortho, mat2d_invert} from "../../lib/mat2d.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Camera2D;

export function sys_resize2d(game: Game, delta: number) {
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

        for (let ent = 0; ent < game.World.Signature.length; ent++) {
            if ((game.World.Signature[ent] & QUERY) === QUERY) {
                update(game, ent);
            }
        }
    }
}

function update(game: Game, entity: Entity) {
    let camera = game.World.Camera2D[entity];

    camera.ViewportWidth = game.ViewportWidth;
    camera.ViewportHeight = game.ViewportHeight;

    let projection = camera.Projection;
    let aspect = game.ViewportWidth / game.ViewportHeight;
    if (projection.Radius[0] === 0 && projection.Radius[1] === 0) {
        // A special case for projections which dynamically resize to keep the
        // unit size in pixels constant. Ignore projection.Radius and instead
        // apply a radius computed taking into account the world unit size in
        // pixels. This is useful for keeping the unit size constant across
        // different viewport dimensions, and help pixel art sprites look crisp.
        let radius = game.ViewportHeight / game.UnitSize / 2;
        mat2d_from_ortho(projection.Projection, radius * aspect, radius);
    } else {
        let target_aspect = projection.Radius[0] / projection.Radius[1];
        if (aspect < target_aspect) {
            // Portrait orientation.
            mat2d_from_ortho(
                projection.Projection,
                projection.Radius[0],
                projection.Radius[0] / aspect,
            );
        } else {
            // Landscape orientation.
            mat2d_from_ortho(
                projection.Projection,
                projection.Radius[1] * aspect,
                projection.Radius[1],
            );
        }
    }

    mat2d_invert(projection.Inverse, projection.Projection);
}
