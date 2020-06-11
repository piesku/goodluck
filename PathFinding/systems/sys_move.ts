import {get_translation} from "../../common/mat4.js";
import {Quat, Vec3} from "../../common/math.js";
import {lerp, multiply, normalize as normalize_quat} from "../../common/quat.js";
import {
    add,
    normalize as normalize_vec3,
    scale,
    transform_direction,
    transform_point,
} from "../../common/vec3.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Move;

export function sys_move(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

const NO_ROTATION: Quat = [0, 0, 0, 1];

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform[entity];
    let move = game.World.Move[entity];

    if (move.Directions.length) {
        let direction = move.Directions.reduce(add_directions);
        let world_position = get_translation([0, 0, 0], transform.World);

        // Transform the movement vector into a direction in the world space.
        let world_direction = transform_direction([0, 0, 0], direction, transform.World);
        normalize_vec3(world_direction, world_direction);

        // Scale by the distance travelled in this tick.
        scale(world_direction, world_direction, move.MoveSpeed * delta);
        let new_position = add([0, 0, 0], world_position, world_direction);

        if (transform.Parent !== undefined) {
            let parent = game.World.Transform[transform.Parent];
            // Transform the movement vector into a point in the local space.
            transform_point(new_position, new_position, parent.Self);
        }
        transform.Translation = new_position;
        transform.Dirty = true;
        move.Directions = [];
    }

    // Rotations applied relative to the local space (parent's or world).
    if (move.LocalRotations.length) {
        let rotation = move.LocalRotations.reduce(multiply_rotations);
        if (move.RotateSpeed < Infinity) {
            // Ease the rotation out by lerping with t ~ delta, which isn't
            // proper lerping, but is good enough to smooth the movement a bit.
            lerp(rotation, NO_ROTATION, rotation, Math.min(move.RotateSpeed * delta, 1));
            normalize_quat(rotation, rotation);
        }

        // Pre-multiply.
        multiply(transform.Rotation, rotation, transform.Rotation);
        transform.Dirty = true;
        move.LocalRotations = [];
    }

    // Rotations applied relative to the self space.
    if (move.SelfRotations.length) {
        let rotation = move.SelfRotations.reduce(multiply_rotations);
        if (move.RotateSpeed < Infinity) {
            // Ease the rotation out by lerping with t ~ delta, which isn't
            // proper lerping, but is good enough to smooth the movement a bit.
            lerp(rotation, NO_ROTATION, rotation, Math.min(move.RotateSpeed * delta, 1));
            normalize_quat(rotation, rotation);
        }

        // Post-multiply.
        multiply(transform.Rotation, transform.Rotation, rotation);
        transform.Dirty = true;
        move.SelfRotations = [];
    }
}

function add_directions(acc: Vec3, cur: Vec3) {
    return add(acc, acc, cur);
}

function multiply_rotations(acc: Quat, cur: Quat) {
    return multiply(acc, acc, cur);
}
