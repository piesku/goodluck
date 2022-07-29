/**
 * @module systems/sys_control_player
 */

import {pointer_down, pointer_ndc_far} from "../../common/input.js";
import {transform_point} from "../../common/mat2d.js";
import {Vec2, Vec3} from "../../common/math.js";
import {distance_squared, scale} from "../../common/vec2.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.ControlPlayer | Has.RigidBody2D;

let pointer_3d_position: Vec3 = [0, 0, 0];
let pointer_2d_position: Vec2 = [0, 0];

export function sys_control_player(game: Game, delta: number) {
    let camera_entity = game.Cameras[0];
    if (camera_entity === undefined) {
        return;
    }

    let camera = game.World.Camera2D[camera_entity];

    if (pointer_ndc_far(pointer_3d_position, game) && pointer_down(game, 0)) {
        pointer_2d_position[0] = pointer_3d_position[0];
        pointer_2d_position[1] = pointer_3d_position[1];

        // The pointer position is in NDC space. Transform it to the eye space...
        transform_point(pointer_2d_position, pointer_2d_position, camera.Projection.Inverse);

        // ...and then to the world space.
        let camera_node = game.World.SpatialNode2D[camera_entity];
        transform_point(pointer_2d_position, pointer_2d_position, camera_node.World);

        for (let i = 0; i < game.World.Signature.length; i++) {
            if ((game.World.Signature[i] & QUERY) === QUERY) {
                update(game, i, pointer_2d_position);
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
