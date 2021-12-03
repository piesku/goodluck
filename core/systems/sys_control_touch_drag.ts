import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Move | Has.ControlPlayer | Has.Transform;
const TOUCH_SENSITIVITY = 0.1;

export function sys_control_touch_drag(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let control = game.World.ControlPlayer[entity];
    let move = game.World.Move[entity];

    if (control.Move && game.InputDistance["Touch0"] > 10 && !game.InputState["Touch1"]) {
        if (game.InputDelta["Touch0X"]) {
            let amount = game.InputDelta["Touch0X"] * TOUCH_SENSITIVITY;
            move.Direction[0] += amount;
        }

        if (game.InputDelta["Touch0Y"]) {
            let amount = game.InputDelta["Touch0Y"] * TOUCH_SENSITIVITY;
            move.Direction[2] += amount;
        }
    }
}
