import {Quat, Vec3} from "../../lib/math.js";
import {quat_look_yaw, quat_multiply, quat_slerp} from "../../lib/quat.js";
import {vec3_add, vec3_normalize, vec3_set, vec3_transform_direction} from "../../lib/vec3.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Move | Has.ControlPlayer;

export function sys_control_keyboard(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

let dir: Vec3 = [0, 0, 0];
let rot: Quat = [0, 0, 0, 1];

function update(game: Game, entity: Entity) {
    let control = game.World.ControlPlayer[entity];
    let transform = game.World.Transform[entity];

    let camera_entity = game.Cameras[0];
    let camera_transform = game.World.Transform[camera_entity];
    let rig_transform = game.World.Transform[camera_transform.Parent!];

    if (control.Move) {
        let move = game.World.Move[entity];
        if (game.InputState["ArrowUp"]) {
            vec3_set(dir, 0, 0, 1);
            vec3_transform_direction(dir, dir, rig_transform.World);
            vec3_transform_direction(dir, dir, transform.Self);
            vec3_add(move.Direction, move.Direction, dir);
        }
        if (game.InputState["ArrowLeft"]) {
            vec3_set(dir, 1, 0, 0);
            vec3_transform_direction(dir, dir, rig_transform.World);
            vec3_transform_direction(dir, dir, transform.Self);
            vec3_add(move.Direction, move.Direction, dir);
        }
        if (game.InputState["ArrowDown"]) {
            vec3_set(dir, 0, 0, -1);
            vec3_transform_direction(dir, dir, rig_transform.World);
            vec3_transform_direction(dir, dir, transform.Self);
            vec3_add(move.Direction, move.Direction, dir);
        }
        if (game.InputState["ArrowRight"]) {
            vec3_set(dir, -1, 0, 0);
            vec3_transform_direction(dir, dir, rig_transform.World);
            vec3_transform_direction(dir, dir, transform.Self);
            vec3_add(move.Direction, move.Direction, dir);
        }

        // Rotate the player towards the direction of movement.
        if (move.Direction[0] !== 0) {
            vec3_normalize(dir, move.Direction);
            quat_look_yaw(rot, dir);
            quat_multiply(rot, rot, transform.Rotation);
            quat_slerp(transform.Rotation, transform.Rotation, rot, 0.2);
            game.World.Signature[entity] |= Has.Dirty;
        }

        // Restrict movement to the XZ plane.
        if (move.Direction[1] !== 0) {
            move.Direction[1] = 0;
        }
    }
}
