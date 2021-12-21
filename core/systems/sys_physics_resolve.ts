/**
 * @module systems/sys_physics_resolve
 */

import {Vec3} from "../../common/math.js";
import {add, copy, dot, normalize, scale} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
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
}

// Temp vector used to compute the reflection off of a static body.
let a: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity) {
    let transform = game.World.Transform[entity];
    let rigid_body = game.World.RigidBody[entity];
    let collide = game.World.Collide[rigid_body.ColliderId];

    if (rigid_body.Kind === RigidKind.Dynamic) {
        rigid_body.IsAirborne = true;
        let has_collision = false;

        for (let i = 0; i < collide.Collisions.length; i++) {
            let collision = collide.Collisions[i];
            if (game.World.Signature[collision.Other] & Has.RigidBody) {
                has_collision = true;

                // Dynamic rigid bodies are only supported for top-level
                // entities. Thus, no need to apply the world → self → local
                // conversion to the collision response. Local space is world space.
                add(transform.Translation, transform.Translation, collision.Hit);
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
                        normalize(a, collision.Hit);
                        // Compute - 2 * (v·n) * n.
                        scale(a, a, -2 * dot(rigid_body.VelocityIntegrated, a));
                        add(rigid_body.VelocityResolved, rigid_body.VelocityIntegrated, a);
                        break;
                    case RigidKind.Dynamic:
                    case RigidKind.Kinematic:
                        copy(rigid_body.VelocityResolved, other_body.VelocityIntegrated);
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
                    rigid_body.IsAirborne = false;
                }
            }
        }

        if (!has_collision) {
            copy(rigid_body.VelocityResolved, rigid_body.VelocityIntegrated);
        }
    } else if (rigid_body.Kind === RigidKind.Kinematic) {
        copy(rigid_body.VelocityResolved, rigid_body.VelocityIntegrated);
    }
}
