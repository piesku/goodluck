/**
 * @module systems/sys_control_always
 */

import {get_translation} from "../../common/mat2d.js";
import {Vec2, Vec3} from "../../common/math.js";
import {distance_squared, subtract} from "../../common/vec2.js";
import {transform_position} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.ControlPlayer | Has.RigidBody2D;

const pointer_world_position: Vec2 = [0, 0];

export function sys_control_player(game: Game, delta: number) {
    let camera_entity = game.Cameras[0];
    if (camera_entity === undefined) {
        return;
    }

    let camera = game.World.Camera[camera_entity];
    let camera_transform = game.World.Transform[camera_entity];

    if (game.InputState["Mouse0"]) {
        let x_ndc = (game.InputState["MouseX"] / game.ViewportWidth) * 2 - 1;
        // In the browser, +Y is down. Invert it, so that in NDC it's up.
        let y_ndc = -(game.InputState["MouseY"] / game.ViewportHeight) * 2 + 1;

        // The pointer position is in NDC space. Transform it to the eye space,
        // and then to the world space.
        let pointer_3d_position: Vec3 = [x_ndc, y_ndc, 0];
        transform_position(pointer_3d_position, pointer_3d_position, camera.Projection.Inverse);
        transform_position(pointer_3d_position, pointer_3d_position, camera_transform.World);

        pointer_world_position[0] = pointer_3d_position[0];
        pointer_world_position[1] = pointer_3d_position[1];

        for (let i = 0; i < game.World.Signature.length; i++) {
            if ((game.World.Signature[i] & QUERY) === QUERY) {
                update(game, i, pointer_world_position);
            }
        }
    }
}

const entity_world_position: Vec2 = [0, 0];
const entity_acceleration: Vec2 = [0, 0];

function update(game: Game, entity: Entity, pointer_position: Vec2) {
    let entity_transform = game.World.Transform2D[entity];
    let entity_body = game.World.RigidBody2D[entity];

    get_translation(entity_world_position, entity_transform.World);
    let distance = distance_squared(pointer_position, entity_world_position) / 10;
    if (distance < 1) {
        distance = 1;
    }

    subtract(entity_acceleration, pointer_position, entity_world_position);
    //normalize(entity_acceleration, entity_acceleration);
    entity_body.Acceleration[0] += entity_acceleration[0] / distance;
    entity_body.Acceleration[1] += entity_acceleration[1] / distance;
}
