/**
 * # sys_physics_integrate
 *
 * The first step of the physics simulation: integrate the [rigid
 * body](com_rigid_body.html)'s acceleration and velocity, and update the
 * entity's transform.
 *
 * For the physics simulation to work correctly, the following order of systems
 * is recommended.
 *
 *     FixedUpdate(delta: number) {
 *         // Apply acceleration and velocity to position.
 *         sys_physics_integrate(this, delta);
 *         // Update transforms.
 *         sys_transform(this, delta);
 *         // Detect collisions.
 *         sys_collide(this, delta);
 *         // Optionally, derive the velocity of kinematic bodies.
 *         sys_physics_kinematic(this, delta);
 *         // Resolve collisions: move colliding bodies apart and swap velocities.
 *         sys_physics_resolve(this, delta);
 *         // Update transforms again to account for collision response.
 *         sys_transform(this, delta);
 *     }
 *
 * For deterministic results, the physics simulation should be run inside
 * `Game.FixedUpdate`. Be careful about processing input inside `FixedUpdate`.
 * It's OK to handle _continuous_ input, like "is the key down for the duration
 * of this update?". On the other hand, handling _discrete_ input inside
 * `FixedUpdate`, like "has the key been pressed during this update?" will lead
 * to skipped input or input applied multiple times.
 */

import {Vec3} from "../../lib/math.js";
import {add, scale, set} from "../../lib/vec3.js";
import {Entity} from "../../lib/world.js";
import {RigidKind} from "../components/com_rigid_body.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.RigidBody;
const GRAVITY = -9.81;

export function sys_physics_integrate(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

const velocity_delta: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform[entity];
    let rigid_body = game.World.RigidBody[entity];

    if (rigid_body.Kind === RigidKind.Dynamic) {
        // Compute change to velocity due to the gravity.
        rigid_body.VelocityLinear[1] += GRAVITY * delta;
        // Compute change to velocity due to external forces.
        scale(rigid_body.Acceleration, rigid_body.Acceleration, delta);
        add(rigid_body.VelocityLinear, rigid_body.VelocityLinear, rigid_body.Acceleration);

        // Apply velocity to position.
        scale(velocity_delta, rigid_body.VelocityLinear, delta);
        add(transform.Translation, transform.Translation, velocity_delta);
        game.World.Signature[entity] |= Has.Dirty;

        // Reset force/acceleration.
        set(rigid_body.Acceleration, 0, 0, 0);
    }
}
