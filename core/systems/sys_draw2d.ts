/**
 * @module systems/sys_draw2d
 */

import {CameraKind} from "../components/com_camera.js";
import {DrawKind} from "../components/com_draw.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.SpatialNode2D | Has.Draw;

export function sys_draw2d(game: Game, delta: number) {
    let camera_entity = game.Cameras[0];
    if (camera_entity === undefined) {
        return;
    }

    let camera = game.World.Camera[camera_entity];
    if (camera.Kind === CameraKind.Xr) {
        throw new Error("XR not implemented");
    }

    let ctx = game.Context2D;
    ctx.resetTransform();
    ctx.fillStyle = "#D7AAA9";
    ctx.fillRect(0, 0, game.ViewportWidth, game.ViewportHeight);

    ctx.transform(
        (camera.Pv[0] / 2) * game.ViewportWidth,
        (camera.Pv[1] / 2) * game.ViewportWidth,
        (camera.Pv[4] / 2) * game.ViewportHeight,
        (camera.Pv[5] / 2) * game.ViewportHeight,
        ((camera.Pv[12] + 1) / 2) * game.ViewportWidth,
        ((camera.Pv[13] + 1) / 2) * game.ViewportHeight
    );

    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) == QUERY) {
            let node = game.World.SpatialNode2D[ent];

            ctx.save();
            ctx.transform(
                node.World[0],
                -node.World[1],
                -node.World[2],
                node.World[3],
                node.World[4],
                -node.World[5]
            );

            let draw = game.World.Draw[ent];
            switch (draw.Kind) {
                case DrawKind.Rect: {
                    ctx.fillStyle = draw.Color;
                    ctx.fillRect(-draw.Width / 2, -draw.Height / 2, draw.Width, draw.Height);
                    break;
                }
                case DrawKind.Arc: {
                    ctx.fillStyle = draw.Color;
                    ctx.beginPath();
                    ctx.arc(0, 0, draw.Radius, draw.StartAngle, draw.EndAngle);
                    ctx.fill();
                    break;
                }
            }

            ctx.restore();
        }
    }
}
