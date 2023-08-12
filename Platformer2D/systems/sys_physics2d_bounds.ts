/**
 * @module systems/sys_physics2d_bounds
 */

import {Entity} from "../../lib/world.js";
import {RigidKind} from "../components/com_rigid_body2d.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.LocalTransform2D | Has.RigidBody2D;

export function sys_physics2d_bounds(game: Game, delta: number) {
    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            update(game, ent, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let local = game.World.LocalTransform2D[entity];
    let rigid_body = game.World.RigidBody2D[entity];

    if (rigid_body.Kind === RigidKind.Dynamic) {
        if (local.Translation[1] > game.World.Height) {
            local.Translation[1] = game.World.Height;
            rigid_body.VelocityLinear[1] *= -rigid_body.Bounciness;
        }

        if (local.Translation[1] < 0) {
            local.Translation[1] = 0;
            rigid_body.VelocityLinear[1] *= -rigid_body.Bounciness;
        }

        if (local.Translation[0] < 0) {
            local.Translation[0] = 0;
            rigid_body.VelocityLinear[0] *= -rigid_body.Bounciness;
        }

        if (local.Translation[0] > game.World.Width) {
            local.Translation[0] = game.World.Width;
            rigid_body.VelocityLinear[0] *= -rigid_body.Bounciness;
        }
    }
}
