/**
 * # sys_camera
 *
 * Update the `PV` matrix of the [camera](com_camera.html).
 */

import {mat4_copy, mat4_get_translation, mat4_multiply} from "../../lib/mat4.js";
import {Entity} from "../../lib/world.js";
import {CameraCanvas, CameraKind, CameraTarget} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    game.Cameras = [];

    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let camera = game.World.Camera[ent];
            let transform = game.World.Transform[ent];
            mat4_copy(camera.World, transform.World);

            switch (camera.Kind) {
                case CameraKind.Canvas:
                case CameraKind.Target:
                    update_camera(game, ent, camera);
                    game.Cameras.push(ent);
                    break;
            }
        }
    }
}

function update_camera(game: Game, entity: Entity, camera: CameraCanvas | CameraTarget) {
    let transform = game.World.Transform[entity];
    let projection = camera.Projection;

    mat4_multiply(camera.Pv, projection.Projection, transform.Self);
    mat4_get_translation(camera.Position, transform.World);
}
