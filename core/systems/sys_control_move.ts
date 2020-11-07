import {Quat, Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.ControlMove | Has.Transform | Has.Move;

export function sys_control_move(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let control = game.World.ControlMove[entity];
    let move = game.World.Move[entity];

    if (control.Direction) {
        move.Directions.push(control.Direction.slice() as Vec3);
    }

    if (control.Rotation) {
        move.LocalRotations.push(control.Rotation.slice() as Quat);
    }
}
