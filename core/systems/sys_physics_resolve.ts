/**
 * # sys_physics_resolve
 *
 * The second step of the physics simulation: resolve the collisions between
 * [rigid bodies](com_rigid_body.html).
 *
 * The positions of colliding rigid bodies are updated to account for the
 * collision response, i.e. the bodies are moved apart. Their velocities are
 * sawpped, too.
 */

import {Vec3} from "../../lib/math.js";
import {vec3_add, vec3_copy, vec3_dot, vec3_normalize, vec3_scale} from "../../lib/vec3.js";
import {Entity} from "../../lib/world.js";
import {RigidKind} from "../components/com_rigid_body.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Collide | Has.RigidBody;

export function sys_physics_resolve(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }

    // When all collisions are resolved, copy resolved velocities to
    // VelocityLinear, for other systems to use.
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let rigid_body = game.World.RigidBody[ent];
            if (rigid_body.Kind === RigidKind.Dynamic) {
                vec3_copy(rigid_body.VelocityLinear, rigid_body.VelocityResolved);
            }
        }
    }
}

// Temp vector used to compute the reflection off of a static body.
let a: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity) {
    let transform = game.World.Transform[entity];
    let rigid_body = game.World.RigidBody[entity];
    let collide = game.World.Collide[rigid_body.ColliderId];

    if (rigid_body.Kind === RigidKind.Dynamic) {
        rigid_body.IsGrounded = false;
        let has_collision = false;

        for (let i = 0; i < collide.Collisions.length; i++) {
            let collision = collide.Collisions[i];
            if (game.World.Signature[collision.Other] & Has.RigidBody) {
                has_collision = true;

                // Dynamic rigid bodies are only supported for top-level
                // entities. Thus, no need to apply the world → self → local
                // conversion to the collision response. Local space is world space.
                vec3_add(transform.Translation, transform.Translation, collision.Hit);
                game.World.Signature[entity] |= Has.Dirty;

                // Assume mass = 1 for all rigid bodies. On collision,
                // velocities are swapped, unless the other body is a static
                // one (and behaves as if it had infinite mass).
                let other_body = game.World.RigidBody[collision.Other];
                switch (other_body.Kind) {
                    case RigidKind.Static:
                        // Compute the reflection vector as
                        //   r = v - 2 * (v·n) * n
                        // where
                        //   v — the incident velocity vector
                        //   n — the normal of the surface of reflection
                        // Compute n.
                        vec3_normalize(a, collision.Hit);
                        // Compute - 2 * (v·n) * n.
                        vec3_scale(a, a, -2 * vec3_dot(rigid_body.VelocityLinear, a));
                        vec3_add(rigid_body.VelocityResolved, rigid_body.VelocityLinear, a);
                        break;
                    case RigidKind.Dynamic:
                    case RigidKind.Kinematic:
                        vec3_copy(rigid_body.VelocityResolved, other_body.VelocityLinear);
                        break;
                }

                // When Bounciness = 1, collisions are 100% elastic.
                vec3_scale(
                    rigid_body.VelocityResolved,
                    rigid_body.VelocityResolved,
                    rigid_body.Bounciness
                );

                if (collision.Hit[1] > 0 && rigid_body.VelocityResolved[1] < 1) {
                    // Collision from the bottom stops the downward movement.
                    rigid_body.VelocityResolved[1] = 0;
                    rigid_body.IsGrounded = true;
                }
            }
        }

        if (!has_collision) {
            vec3_copy(rigid_body.VelocityResolved, rigid_body.VelocityLinear);
        }
    }
}
