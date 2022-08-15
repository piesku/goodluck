import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.ControlPlayer | Has.Move2D | Has.RigidBody2D;

export function sys_control_keyboard(game: Game, delta: number) {
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) == QUERY) {
            update(game, ent);
        }
    }
}

function update(game: Game, entity: Entity) {
    let move = game.World.Move2D[entity];
    let rigid_body = game.World.RigidBody2D[entity];

    if (game.InputState["ArrowLeft"]) {
        move.Direction[0] -= 1;
        game.World.Signature[entity] |= Has.Dirty;
    }

    if (game.InputState["ArrowRight"]) {
        move.Direction[0] += 1;
        game.World.Signature[entity] |= Has.Dirty;
    }

    if (game.InputState["ArrowUp"] && rigid_body.IsGrounded) {
        rigid_body.Acceleration[1] = 500;
    }
}
