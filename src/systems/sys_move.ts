import {Animate} from "../components/com_animate.js";
import {Get} from "../components/com_index.js";
import {components_of_type} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {Quat, Vec3} from "../math/index.js";
import {get_translation} from "../math/mat4.js";
import {multiply} from "../math/quat.js";
import {add, normalize, scale, transform_direction, transform_mat4} from "../math/vec3.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Move);

export function sys_move(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game[Get.Transform][entity];
    let move = game[Get.Move][entity];
    for (let animate of components_of_type<Animate>(game, transform, Get.Animate)) {
        if (!animate.trigger) {
            animate.trigger = move.directions.length ? "move" : "idle";
        }
    }

    if (move.directions.length) {
        let direction = move.directions.reduce(add_directions);
        let world_position = get_translation([], transform.world);

        // Transform the movement vector into a direction in the world space.
        let world_direction = transform_direction([], direction, transform.world);
        normalize(world_direction, world_direction);

        // Scale by the distance travelled in this tick.
        scale(world_direction, world_direction, move.move_speed * delta);
        let new_position = add([], world_position, world_direction);

        if (transform.parent) {
            // Transform the movement vector into a point in the local space.
            transform_mat4(new_position, new_position, transform.parent.self);
        }
        transform.translation = new_position;
        transform.dirty = true;
        move.directions.length = 0;
    }

    if (move.yaws.length) {
        let yaw = move.yaws.reduce(multiply_rotations);
        // Yaw is applied relative to the world space.
        multiply(transform.rotation, yaw, transform.rotation);
        transform.dirty = true;
        move.yaws.length = 0;
    }

    if (move.pitches.length) {
        let pitch = move.pitches.reduce(multiply_rotations);
        // Pitch is applied relative to the self space.
        multiply(transform.rotation, transform.rotation, pitch);
        transform.dirty = true;
        move.pitches.length = 0;
    }
}

function add_directions(acc: Vec3, cur: Vec3) {
    return add(acc, acc, cur);
}

function multiply_rotations(acc: Quat, cur: Quat) {
    return multiply(acc, acc, cur);
}
