/**
 * @module systems/sys_physics_integrate
 */

import {float} from "../../common/random.js";
import {Entity} from "../../common/world.js";
import {RigidKind} from "../components/com_rigid_body2d.js";
import {Game, UNIT_PX} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform2D | Has.RigidBody2D;

export function sys_physics2d_bounds(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform2D[entity];
    let rigid_body = game.World.RigidBody2D[entity];

    if (rigid_body.Kind === RigidKind.Dynamic) {
        let bottom = -game.ViewportHeight / 2 / UNIT_PX;
        let left = -game.ViewportWidth / 2 / UNIT_PX;

        if (transform.Translation[1] < bottom) {
            transform.Translation[1] = bottom;
            rigid_body.VelocityIntegrated[1] *= float(-3, -1);
        }

        if (transform.Translation[0] < left) {
            transform.Translation[0] = left;
            rigid_body.VelocityIntegrated[0] *= -1;
        }

        if (transform.Translation[0] > -left) {
            transform.Translation[0] = -left;
            rigid_body.VelocityIntegrated[0] *= -1;
        }
    }
}
