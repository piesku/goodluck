import {add} from "../../common/vec3.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Collide | Has.RigidBody;
const GRAVITY = -9.81;

export function sys_physics(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform[entity];
    let collide = game.World.Collide[entity];
    let rigid_body = game.World.RigidBody[entity];

    if (rigid_body.Dynamic) {
        transform.Dirty = true;
        transform.Translation[1] += rigid_body.VelY * delta;
        rigid_body.VelY += GRAVITY * delta;
        rigid_body.VelY += rigid_body.AccY * delta;
        rigid_body.AccY = 0;

        for (let i = 0; i < collide.Collisions.length; i++) {
            let collision = collide.Collisions[i];
            if (game.World.Mask[collision.Other] & Has.RigidBody) {
                // Dynamic rigid bodies are only supported for top-level
                // entities. Thus, no need to apply the world → self → local
                // conversion to the collision response. Local space is world space.
                add(transform.Translation, transform.Translation, collision.Hit);

                if (
                    // The rigid body was falling and hit something below it.
                    (collision.Hit[1] > 0 && rigid_body.VelY < 0) ||
                    // The rigid body was going up and hit something above it.
                    (collision.Hit[1] < 0 && rigid_body.VelY > 0)
                ) {
                    rigid_body.VelY = 0;
                }
            }
        }
    }
}
