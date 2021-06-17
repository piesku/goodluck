/**
 * @module systems/sys_physics_kinematic
 */

import {get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {copy, scale, subtract} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
import {RigidKind} from "../components/com_rigid_body.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.RigidBody;

export function sys_physics_kinematic(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform[entity];
    let rigid_body = game.World.RigidBody[entity];

    if (rigid_body.Kind === RigidKind.Kinematic) {
        let current_position: Vec3 = [0, 0, 0];
        get_translation(current_position, transform.World);
        let movement: Vec3 = [0, 0, 0];
        subtract(movement, current_position, rigid_body.LastPosition);

        // Compute velocity from this frame's movement.
        scale(rigid_body.VelocityIntegrated, movement, 1 / delta);

        copy(rigid_body.LastPosition, current_position);
    }
}
