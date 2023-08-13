import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";
import {GRAVITY} from "./sys_physics2d_integrate.js";

const QUERY = Has.ControlPlayer | Has.RigidBody2D;
const SPEED_MOVE = 400;
const SPEED_JUMP = 600;

export function sys_control_keyboard(game: Game, delta: number) {
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) == QUERY) {
            update(game, ent, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let rigid_body = game.World.RigidBody2D[entity];

    if (game.InputState["ArrowLeft"]) {
        rigid_body.VelocityLinear[0] = -SPEED_MOVE * delta;
    }

    if (game.InputState["ArrowRight"]) {
        rigid_body.VelocityLinear[0] = SPEED_MOVE * delta;
    }

    if (game.InputState["ArrowUp"]) {
        rigid_body.Acceleration[1] = -GRAVITY / 3;

        if (rigid_body.IsGrounded) {
            rigid_body.VelocityLinear[1] = SPEED_JUMP * delta;
        }
    }
}
