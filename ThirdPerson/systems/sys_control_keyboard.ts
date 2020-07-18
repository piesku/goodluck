import {Vec3} from "../../common/math.js";
import {get_axis} from "../../common/quat.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Move | Has.ControlPlayer;

export function sys_control_keyboard(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

let axis: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity) {
    let control = game.World.ControlPlayer[entity];

    if (control.Move) {
        let move = game.World.Move[entity];
        if (game.InputState["KeyW"]) {
            // Move forward
            move.Directions.push([0, 0, 1]);
        }
        if (game.InputState["KeyA"]) {
            // Strafe left
            move.Directions.push([1, 0, 0]);
        }
        if (game.InputState["KeyS"]) {
            // Move backward
            move.Directions.push([0, 0, -1]);
        }
        if (game.InputState["KeyD"]) {
            // Strafe right
            move.Directions.push([-1, 0, 0]);
        }
    }

    if (control.Yaw) {
        // Yaw is applied relative to the entity's local space; the Y axis is
        // not affected by its current orientation.
        let move = game.World.Move[entity];
        if (game.InputState["ArrowLeft"]) {
            // Look left.
            move.LocalRotations.push([0, 1, 0, 0]);
        }
        if (game.InputState["ArrowRight"]) {
            // Look right.
            move.LocalRotations.push([0, -1, 0, 0]);
        }
    } else if (control.Pitch) {
        let transform = game.World.Transform[entity];
        let move = game.World.Move[entity];

        // The angle returned by get_axis_angle is always positive. The
        // direction of the rotation is indicated by the axis: [1, 0, 0] for
        // looking down and [-1, 0, 0] for looking up. The x component of the
        // axis may not be exactly 1 or -1, but it's close enough that we can
        // just multiply by it as if it was Math.sign.
        let current_pitch = get_axis(axis, transform.Rotation);
        current_pitch *= axis[0];
        if (game.InputState["ArrowUp"] && current_pitch > -0.2) {
            // Look up.
            move.SelfRotations.push([-1, 0, 0, 0]);
        }
        if (game.InputState["ArrowDown"] && current_pitch < Math.PI / 2.2) {
            // Look down.
            move.SelfRotations.push([1, 0, 0, 0]);
        }
    }
}
