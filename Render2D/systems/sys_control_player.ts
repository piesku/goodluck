/**
 * @module systems/sys_control_player
 */

import {pointer_down, pointer_viewport} from "../../lib/input.js";
import {Vec2} from "../../lib/math.js";
import {distance_squared, scale} from "../../lib/vec2.js";
import {Entity} from "../../lib/world.js";
import {viewport_to_world} from "../components/com_camera2d.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.ControlPlayer | Has.RigidBody2D;

let pointer_position: Vec2 = [0, 0];

export function sys_control_player(game: Game, delta: number) {
    let camera_entity = game.Cameras[0];
    if (camera_entity === undefined) {
        return;
    }

    let camera = game.World.Camera2D[camera_entity];

    if (pointer_viewport(game, pointer_position) && pointer_down(game, 0)) {
        viewport_to_world(pointer_position, camera, pointer_position);

        for (let i = 0; i < game.World.Signature.length; i++) {
            if ((game.World.Signature[i] & QUERY) === QUERY) {
                update(game, i, pointer_position);
            }
        }
    }
}

function update(game: Game, entity: Entity, pointer_position: Vec2) {
    let local = game.World.LocalTransform2D[entity];
    let rigid_body = game.World.RigidBody2D[entity];

    let distance = distance_squared(pointer_position, local.Translation);
    if (distance < 5) {
        rigid_body.Acceleration[0] = local.Translation[0] - pointer_position[0];
        rigid_body.Acceleration[1] = local.Translation[1] - pointer_position[1];
        scale(rigid_body.Acceleration, rigid_body.Acceleration, 100);
    }
}
