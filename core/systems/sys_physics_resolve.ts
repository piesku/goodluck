import {add, copy, scale} from "../../common/vec3.js";
import {RigidKind} from "../components/com_rigid_body.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Collide | Has.RigidBody;

export function sys_physics_resolve(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game.World.Transform[entity];
    let collide = game.World.Collide[entity];
    let rigid_body = game.World.RigidBody[entity];

    if (rigid_body.Kind === RigidKind.Dynamic) {
        let has_collision = false;

        for (let i = 0; i < collide.Collisions.length; i++) {
            let collision = collide.Collisions[i];
            if (game.World.Signature[collision.Other] & Has.RigidBody) {
                has_collision = true;

                // Dynamic rigid bodies are only supported for top-level
                // entities. Thus, no need to apply the world → self → local
                // conversion to the collision response. Local space is world space.
                add(transform.Translation, transform.Translation, collision.Hit);
                transform.Dirty = true;

                // Assume mass = 1 for all rigid bodies. On collision,
                // velocities are swapped, unless the other body is a static
                // one (and behaves as if it had infinite mass).
                let other_body = game.World.RigidBody[collision.Other];
                switch (other_body.Kind) {
                    case RigidKind.Static:
                        // We should compute the reflection vector as
                        //   r = v - 2 * (v·n) * n
                        // where
                        //   v is the incident velocity vector
                        //   n is the normal of the surface of reflection
                        // The only static rigid body in the game is the ground:
                        //   n = [0,1,0]
                        // We simplify:
                        //   r = v - 2 * v[1] * n
                        //   r = v - [0, 2 * v[1], 0]
                        //   r[1] = v[1] - 2 * v[1]
                        //   r[1] = v[1] * -1
                        rigid_body.VelocityResolved[1] *= -1;
                        break;
                    case RigidKind.Dynamic:
                    case RigidKind.Kinematic:
                        copy(rigid_body.VelocityResolved, other_body.VelocityIntegrated);
                        break;
                }

                // Collisions aren't 100% elastic.
                scale(rigid_body.VelocityResolved, rigid_body.VelocityResolved, 0.8);

                if (collision.Hit[1] > 0 && rigid_body.VelocityResolved[1] < 1) {
                    // Collision from the bottom stops the downward movement.
                    rigid_body.VelocityResolved[1] = 0;
                }
            }
        }

        if (!has_collision) {
            copy(rigid_body.VelocityResolved, rigid_body.VelocityIntegrated);
        }
    }
}
