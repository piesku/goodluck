import {Entity} from "../../common/world.js";
import {query_down} from "../components/com_children.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.ControlPlayer | Has.RigidBody;

export function sys_control_jump(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let control = game.World.ControlPlayer[entity];
    let rigid_body = game.World.RigidBody[entity];

    if (control.Move) {
        if (game.InputState["Space"]) {
            // Jump
            if (!rigid_body.IsAirborne) {
                rigid_body.Acceleration[1] += 300;

                for (let ent of query_down(game.World, entity, Has.Animate)) {
                    game.World.Animate[ent].Trigger = "jump";
                }
            }
        }

        // TODO: Implement touch and gamepad controls for jumping.
    }
}
