import {get_translation} from "../../common/mat4.js";
import {Quat, Vec3} from "../../common/math.js";
import {multiply} from "../../common/quat.js";
import {add, normalize, scale, transform_direction, transform_point} from "../../common/vec3.js";
import {Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Transform | Has.Move;

export function sys_move(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform[entity];
    let move = game.World.Move[entity];

    if (move.Directions.length) {
        let direction = move.Directions.reduce(add_directions);
        let world_position = get_translation([0, 0, 0], transform.World);

        // Transform the movement vector into a direction in the world space.
        let world_direction = transform_direction([0, 0, 0], direction, transform.World);
        normalize(world_direction, world_direction);

        // Scale by the distance travelled in this tick.
        scale(world_direction, world_direction, move.MoveSpeed * delta);
        let new_position = add([0, 0, 0], world_position, world_direction);

        if (transform.Parent) {
            // Transform the movement vector into a point in the local space.
            transform_point(new_position, new_position, transform.Parent.Self);
        }
        transform.Translation = new_position;
        transform.Dirty = true;
        move.Directions = [];
    }

    if (move.Yaws.length) {
        let yaw = move.Yaws.reduce(multiply_rotations);
        // Yaw is applied relative to the world space.
        multiply(transform.Rotation, yaw, transform.Rotation);
        transform.Dirty = true;
        move.Yaws = [];
    }

    if (move.Pitches.length) {
        let pitch = move.Pitches.reduce(multiply_rotations);
        // Pitch is applied relative to the self space.
        multiply(transform.Rotation, transform.Rotation, pitch);
        transform.Dirty = true;
        move.Pitches = [];
    }
}

function add_directions(acc: Vec3, cur: Vec3) {
    return add(acc, acc, cur);
}

function multiply_rotations(acc: Quat, cur: Quat) {
    return multiply(acc, acc, cur);
}
