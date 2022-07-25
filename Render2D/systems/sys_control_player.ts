/**
 * @module systems/sys_control_player
 */

import {pointer_down, pointer_ndc_far} from "../../common/input.js";
import {get_translation, transform_point} from "../../common/mat2d.js";
import {Vec2, Vec3} from "../../common/math.js";
import {distance_squared, scale} from "../../common/vec2.js";
import {transform_position} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
import {CameraKind} from "../components/com_camera.js";
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

    let camera = game.World.Camera[camera_entity];
    if (camera.Kind === CameraKind.Xr) {
        throw new Error("XR not implemented");
    }

    if (pointer_ndc_far(pointer_3d_position, game) && pointer_down(game, 0)) {
        // The pointer position is in NDC space. Transform it to the eye space...
        transform_position(pointer_3d_position, pointer_3d_position, camera.Projection.Inverse);

        // ...and then to the world space.
        let camera_transform = game.World.Transform2D[camera_entity];
        pointer_2d_position[0] = pointer_3d_position[0];
        pointer_2d_position[1] = pointer_3d_position[1];
        transform_point(pointer_2d_position, pointer_2d_position, camera_transform.World);

        for (let i = 0; i < game.World.Signature.length; i++) {
            if ((game.World.Signature[i] & QUERY) === QUERY) {
                update(game, i, pointer_2d_position);
            }
        }
    }
}

const entity_world_position: Vec2 = [0, 0];

function update(game: Game, entity: Entity, pointer_position: Vec2) {
    let entity_transform = game.World.Transform2D[entity];
    let entity_body = game.World.RigidBody2D[entity];

    get_translation(entity_world_position, entity_transform.World);
    let distance = distance_squared(pointer_position, entity_world_position);
    if (distance < 5) {
        entity_body.Acceleration[0] = entity_world_position[0] - pointer_position[0];
        entity_body.Acceleration[1] = entity_world_position[1] - pointer_position[1];
        scale(entity_body.Acceleration, entity_body.Acceleration, 100);
    }
}
