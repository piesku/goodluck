/**
 * # sys_camera2d
 *
 * Update the `PV` matrix of the [camera](com_camera2d.html) used for 2D
 * rendering.
 */

import {mat2d_copy, mat2d_multiply} from "../../lib/mat2d.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.SpatialNode2D | Has.Camera2D;

export function sys_camera2d(game: Game, delta: number) {
    game.Cameras = [];

    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let camera = game.World.Camera2D[ent];
            let camera_node = game.World.SpatialNode2D[ent];

            mat2d_multiply(camera.Pv, camera.Projection.Projection, camera_node.Self);
            mat2d_copy(camera.World, camera_node.World);

            game.Cameras.push(ent);
        }
    }
}
