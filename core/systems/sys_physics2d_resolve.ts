/**
 * # sys_physics_resolve
 *
 * The second step of the physics simulation: resolve the collisions between
 * [rigid bodies](com_rigid_body2d.html).
 *
 * The positions of colliding rigid bodies are updated to account for the
 * collision response, i.e. the bodies are moved apart. Their velocities are
 * sawpped, too.
 */

import {Vec2} from "../../lib/math.js";
import {add, copy, dot, normalize, scale} from "../../lib/vec2.js";
import {Entity} from "../../lib/world.js";
import {RigidKind} from "../components/com_rigid_body2d.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.LocalTransform2D | Has.Collide2D | Has.RigidBody2D;

export function sys_physics2d_resolve(game: Game, delta: number) {
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            update(game, ent);
        }
    }

    // When all collisions are resolved, copy resolved velocities to
    // VelocityLinear, for other systems to use.
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            let rigid_body = game.World.RigidBody2D[ent];
            if (rigid_body.Kind === RigidKind.Dynamic) {
                copy(rigid_body.VelocityLinear, rigid_body.VelocityResolved);
            }
        }
    }
}

// Temp vector used to compute the reflection off of a static body.
let a: Vec2 = [0, 0];

function update(game: Game, entity: Entity) {
    let local = game.World.LocalTransform2D[entity];
    let rigid_body = game.World.RigidBody2D[entity];
    let collide = game.World.Collide2D[entity];

    if (rigid_body.Kind === RigidKind.Dynamic) {
        rigid_body.IsGrounded = false;
        let has_collision = false;

        for (let i = 0; i < collide.Collisions.length; i++) {
            let collision = collide.Collisions[i];
            if (game.World.Signature[collision.Other] & Has.RigidBody2D) {
                has_collision = true;

                // Dynamic rigid bodies are only supported for top-level
                // entities. Thus, no need to apply the world → self → local
                // conversion to the collision response. Local space is world space.
                add(local.Translation, local.Translation, collision.Hit);
                game.World.Signature[entity] |= Has.Dirty;

                // Assume mass = 1 for all rigid bodies. On collision,
                // velocities are swapped, unless the other body is a static
                // one (and behaves as if it had infinite mass).
                let other_body = game.World.RigidBody2D[collision.Other];
                switch (other_body.Kind) {
                    case RigidKind.Static:
                        // Compute the reflection vector as
                        //   r = v - 2 * (v·n) * n
                        // where
                        //   v — the incident velocity vector
                        //   n — the normal of the surface of reflection
                        // Compute n.
                        normalize(a, collision.Hit);
                        // Compute - 2 * (v·n) * n.
                        scale(a, a, -2 * dot(rigid_body.VelocityLinear, a));
                        add(rigid_body.VelocityResolved, rigid_body.VelocityLinear, a);
                        break;
                    case RigidKind.Dynamic:
                        copy(rigid_body.VelocityResolved, other_body.VelocityLinear);
                        break;
                }

                // When Bounciness = 1, collisions are 100% elastic.
                scale(
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
            copy(rigid_body.VelocityResolved, rigid_body.VelocityLinear);
        }
    }
}
