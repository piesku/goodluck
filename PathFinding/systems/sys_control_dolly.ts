import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY_CAMERA = Has.Camera | Has.Move | Has.Transform;
const QUERY_RIG = Has.ControlDolly | Has.Move;
const INITIAL_CAMERA_Y = 100;
const DOLLY_FACTOR = 1.1;

export function sys_control_dolly(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY_CAMERA) === QUERY_CAMERA) {
            update_camera_dolly(game, i);
        }
    }

    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY_RIG) === QUERY_RIG) {
            update_move_speed(game, i);
        }
    }
}

function update_camera_dolly(game: Game, entity: Entity) {
    let move = game.World.Move[entity];
    let transform = game.World.Transform[entity];

    game.CameraDolly = transform.Translation[1] / INITIAL_CAMERA_Y;

    if (game.InputDelta["WheelY"]) {
        move.Direction[2] += game.InputDelta["WheelY"];
    }

    if (game.InputState["Touch0"] && game.InputState["Touch1"]) {
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
        move.Direction[2] += hypot_curr - hypot_last;
    }
}

function update_move_speed(game: Game, entity: Entity) {
    let control = game.World.ControlDolly[entity];
    let move = game.World.Move[entity];

    move.MoveSpeed = control.MoveSpeed * game.CameraDolly ** DOLLY_FACTOR;
}

function hypot_squared(a: number, b: number) {
    return a * a + b * b;
}
