/**
 * # sys_physics_kinematic
 *
 * Derive the velocity of kinematic [rigid bodies](com_rigid_body.html) from the
 * change in their position.
 *
 * This allows entities to move by changing their transform directly (e.g.
 * through [`sys_move`](sys_move.html)) and also take part in the physics
 * simulation, in particular in the collision response step in
 * [`sys_physics_resolve`](sys_physics_resolve.html).
 */

import {mat4_get_translation} from "../../lib/mat4.js";
import {Vec3} from "../../lib/math.js";
import {vec3_copy, vec3_scale, vec3_subtract} from "../../lib/vec3.js";
import {Entity} from "../../lib/world.js";
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

const current_position: Vec3 = [0, 0, 0];
const movement_delta: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform[entity];
    let rigid_body = game.World.RigidBody[entity];

    mat4_get_translation(current_position, transform.World);

    if (rigid_body.Kind === RigidKind.Kinematic) {
        vec3_subtract(movement_delta, current_position, rigid_body.LastPosition);

        // Compute velocity from this frame's movement.
        vec3_scale(rigid_body.VelocityLinear, movement_delta, 1 / delta);
    }

    vec3_copy(rigid_body.LastPosition, current_position);
}
