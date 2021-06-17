import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Move | Has.ControlCamera | Has.Transform;
const TOUCH_SENSITIVITY = 0.1;
const ZOOM_FACTOR = 0.9;

export function sys_control_touch(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let control = game.World.ControlCamera[entity];
    let move = game.World.Move[entity];

    if (control.Move && game.InputDistance["Touch0"] > 10 && !game.InputState["Touch1"]) {
        move.MoveSpeed = control.Move * game.CameraZoom ** ZOOM_FACTOR;
        if (game.InputDelta["Touch0X"]) {
            let amount = game.InputDelta["Touch0X"] * TOUCH_SENSITIVITY;
            move.Directions.push([amount, 0, 0]);
        }

        if (game.InputDelta["Touch0Y"]) {
            let amount = game.InputDelta["Touch0Y"] * TOUCH_SENSITIVITY;
            move.Directions.push([0, 0, amount]);
        }
    }

    if (control.Zoom && game.InputState["Touch0"] && game.InputState["Touch1"]) {
        move.MoveSpeed = (control.Zoom * game.CameraZoom) ** ZOOM_FACTOR;
        let hypot_curr = hypot_squared(
            game.InputState["Touch0X"] - game.InputState["Touch1X"],
            game.InputState["Touch0Y"] - game.InputState["Touch1Y"]
        );
        let hypot_last = hypot_squared(
            game.InputState["Touch0X"] +
                game.InputDelta["Touch0X"] -
                game.InputState["Touch1X"] -
                game.InputDelta["Touch1X"],
            game.InputState["Touch0Y"] +
                game.InputDelta["Touch0Y"] -
                game.InputState["Touch1Y"] -
                game.InputDelta["Touch1Y"]
        );
        move.Directions.push([0, 0, hypot_curr - hypot_last]);
    }
}

function hypot_squared(a: number, b: number) {
    return a * a + b * b;
}
