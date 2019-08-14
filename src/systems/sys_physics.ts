import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {add} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Collide) | (1 << Get.RigidBody);
const GRAVITY = -9.81;

export function sys_physics(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game[Get.Transform][entity];
    let collide = game[Get.Collide][entity];
    let rigid_body = game[Get.RigidBody][entity];

    if (rigid_body.dynamic) {
        transform.dirty = true;
        transform.translation[1] += rigid_body.vy * delta;
        rigid_body.vy += GRAVITY * delta;
        rigid_body.vy += rigid_body.ay * delta;
        rigid_body.ay = 0;

        for (let i = 0; i < collide.collisions.length; i++) {
            let collision = collide.collisions[i];
            if (game.world[collision.other.entity] & (1 << Get.RigidBody)) {
                // Dynamic rigid bodies are only supported for top-level
                // entities. Thus, no need to apply the world → self → local
                // conversion to the collision response. Local space is world space.
                add(transform.translation, transform.translation, collision.hit);

                if (
                    // The rigid body was falling and hit something below it.
                    (collision.hit[1] > 0 && rigid_body.vy < 0) ||
                    // The rigid body was going up and hit something above it.
                    (collision.hit[1] < 0 && rigid_body.vy > 0)
                ) {
                    rigid_body.vy = 0;
                }
            }
        }
    }
}
