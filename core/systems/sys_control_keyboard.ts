import {get_pitch, multiply} from "../../common/quat.js";
import {Entity} from "../../common/world.js";
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

function update(game: Game, entity: Entity) {
    let control = game.World.ControlPlayer[entity];

    if (control.Move) {
        let move = game.World.Move[entity];
        if (game.InputState["KeyW"]) {
            // Move forward
            move.Direction[2] += 1;
        }
        if (game.InputState["KeyA"]) {
            // Strafe left
            move.Direction[0] += 1;
        }
        if (game.InputState["KeyS"]) {
            // Move backward
            move.Direction[2] -= 1;
        }
        if (game.InputState["KeyD"]) {
            // Strafe right
            move.Direction[0] -= 1;
        }
    }

    if (control.Yaw) {
        // Yaw is applied relative to the entity's local space; the Y axis is
        // not affected by its current orientation.
        let move = game.World.Move[entity];
        if (game.InputState["ArrowLeft"]) {
            // Look left.
            multiply(move.LocalRotation, move.LocalRotation, [0, 1, 0, 0]);
        }
        if (game.InputState["ArrowRight"]) {
            // Look right.
            multiply(move.LocalRotation, move.LocalRotation, [0, -1, 0, 0]);
        }
    }

    if (control.Pitch) {
        // Pitch is applied relative to the entity's self space; the X axis is
        // always aligned with its left and right sides.
        let transform = game.World.Transform[entity];
        let move = game.World.Move[entity];

        let current_pitch = get_pitch(transform.Rotation);
        if (game.InputState["ArrowUp"] && current_pitch > control.MinPitch) {
            // Look up.
            multiply(move.SelfRotation, move.SelfRotation, [-1, 0, 0, 0]);
        }
        if (game.InputState["ArrowDown"] && current_pitch < control.MaxPitch) {
            // Look down.
            multiply(move.SelfRotation, move.SelfRotation, [1, 0, 0, 0]);
        }
    }
}
