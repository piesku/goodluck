/**
 * @module systems/sys_camera
 */

import {copy, get_translation, multiply} from "../../common/mat4.js";
import {Entity} from "../../common/world.js";
import {Camera, CameraKind, CameraXr} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    game.Cameras = [];

    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let camera = game.World.Camera[ent];
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

function update_camera(game: Game, entity: Entity, camera: Exclude<Camera, CameraXr>) {
    let transform = game.World.Transform[entity];
    let projection = camera.Projection;

    copy(camera.View, transform.Self);
    multiply(camera.Pv, projection.Projection, camera.View);
    get_translation(camera.Position, transform.World);
}
