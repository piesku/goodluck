import {DEG_TO_RAD, Quat, Vec2, Vec3} from "../../common/math.js";
import {clamp} from "../../common/number.js";
import {from_axis, multiply} from "../../common/quat.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Move | Has.ControlPlayer;
const AXIS_Y: Vec3 = [0, 1, 0];
const AXIS_X: Vec3 = [1, 0, 0];
const DEAD_ZONE = 0.01;
const TOUCH_SENSITIVITY = 10;

// The position of the joystick center, given by the initial Touch0's x and y.
let joystick: Vec2 = [0, 0];
let rotation: Quat = [0, 0, 0, 0];

export function sys_control_touch(game: Game, delta: number) {
    if (game.InputDelta["Touch0"] === 1) {
        // The center of the invisible joystick is given by the position of the
        // first touch of the first finger on the screen's surface.
        joystick[0] = game.InputState["Touch0X"];
        joystick[1] = game.InputState["Touch0Y"];
    }

    for (let i = 0; i < game.World.Components.length; i++) {
        if ((game.World.Components[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game.World.Transform[entity];
    let control = game.World.ControlPlayer[entity];
    let move = game.World.Move[entity];

    if (control.Move && game.InputState["Touch0"] === 1) {
        let divider = Math.min(game.ViewportWidth, game.ViewportHeight);
        let amount_x = (game.InputState["Touch0X"] - joystick[0]) / divider;
        let amount_y = (game.InputState["Touch0Y"] - joystick[1]) / divider;

        if (Math.abs(amount_x) > DEAD_ZONE) {
            // Strafe movement.
            move.Directions.push([clamp(-1, 1, -amount_x), 0, 0]);
        }
        if (Math.abs(amount_y) > DEAD_ZONE) {
            // Forward movement.
            move.Directions.push([0, 0, clamp(-1, 1, -amount_y)]);
        }
    }

    if (control.Yaw && game.InputDelta["Touch1X"]) {
        let amount = game.InputDelta["Touch1X"] * control.Yaw * TOUCH_SENSITIVITY;
        // See sys_control_mouse.
        from_axis(rotation, AXIS_Y, -amount * DEG_TO_RAD);
        multiply(transform.Rotation, rotation, transform.Rotation);
        transform.Dirty = true;
    }

    if (control.Pitch && game.InputDelta["Touch1Y"]) {
        let amount = game.InputDelta["Touch1Y"] * control.Pitch * TOUCH_SENSITIVITY;
        // See sys_control_mouse.
        from_axis(rotation, AXIS_X, amount * DEG_TO_RAD);
        multiply(transform.Rotation, transform.Rotation, rotation);
        transform.Dirty = true;
    }
}
