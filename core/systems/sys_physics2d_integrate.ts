/**
 * # sys_physics_integrate
 *
 * The first step of the physics simulation: integrate the [rigid
 * body](com_rigid_body2d.html)'s acceleration and velocity, and update the
 * entity's transform.
 */

import {Vec2} from "../../lib/math.js";
import {vec2_add, vec2_scale, vec2_set} from "../../lib/vec2.js";
import {Entity} from "../../lib/world.js";
import {RigidKind} from "../components/com_rigid_body2d.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.LocalTransform2D | Has.RigidBody2D;
export const GRAVITY = -66;

export function sys_physics2d_integrate(game: Game, delta: number) {
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            update(game, ent, delta);
        }
    }
}

let velocity_drag: Vec2 = [0, 0];
let velocity_delta: Vec2 = [0, 0];

function update(game: Game, entity: Entity, delta: number) {
    let local = game.World.LocalTransform2D[entity];
    let rigid_body = game.World.RigidBody2D[entity];

    if (rigid_body.Kind === RigidKind.Dynamic) {
        // Compute change to velocity due to the gravity.
        rigid_body.VelocityLinear[1] += GRAVITY * delta;
        // Compute change to velocity due to external forces.
        vec2_scale(rigid_body.Acceleration, rigid_body.Acceleration, delta);
        vec2_add(rigid_body.VelocityLinear, rigid_body.VelocityLinear, rigid_body.Acceleration);
        // Compute and apply drag.
        vec2_scale(velocity_drag, rigid_body.VelocityLinear, -rigid_body.Drag);
        vec2_add(rigid_body.VelocityLinear, rigid_body.VelocityLinear, velocity_drag);

        // Apply velocity to position.
        vec2_scale(velocity_delta, rigid_body.VelocityLinear, delta);
        vec2_add(local.Translation, local.Translation, velocity_delta);
        local.Rotation += rigid_body.VelocityAngular * delta;
        game.World.Signature[entity] |= Has.Dirty;

        // Reset force/acceleration.
        vec2_set(rigid_body.Acceleration, 0, 0);
    }
}
