import {Vec3} from "../../common/math.js";
import {from_axis} from "../../common/quat.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Move | Has.ControlPlayer;
const AXIS_X = <Vec3>[1, 0, 0];
const AXIS_Y = <Vec3>[0, 1, 0];

export function sys_control_keyboard(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
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
            move.LocalRotations.push(from_axis([0, 0, 0, 0], AXIS_Y, Math.PI));
        }
        if (game.InputState["ArrowRight"]) {
            // Look right.
            move.LocalRotations.push(from_axis([0, 0, 0, 0], AXIS_Y, -Math.PI));
        }
    }

    if (control.Pitch) {
        // Pitch is applied relative to the entity's self space; the X axis is
        // always aligned with its left and right sides.
        let move = game.World.Move[entity];
        if (game.InputState["ArrowUp"]) {
            // Look up.
            move.SelfRotations.push(from_axis([0, 0, 0, 0], AXIS_X, -Math.PI));
        }
        if (game.InputState["ArrowDown"]) {
            // Look down.
            move.SelfRotations.push(from_axis([0, 0, 0, 0], AXIS_X, Math.PI));
        }
    }
}
