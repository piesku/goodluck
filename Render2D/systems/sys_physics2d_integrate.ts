/**
 * @module systems/sys_physics_integrate
 */

import {Vec2} from "../../common/math.js";
import {add, scale, set} from "../../common/vec2.js";
import {Entity} from "../../common/world.js";
import {RigidKind} from "../components/com_rigid_body2d.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform2D | Has.RigidBody2D;
const GRAVITY = 0;

export function sys_physics2d_integrate(game: Game, delta: number) {
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
        // Compute change to velocity, including the gravity.
        scale(rigid_body.Acceleration, rigid_body.Acceleration, delta);
        add(rigid_body.VelocityIntegrated, rigid_body.VelocityIntegrated, rigid_body.Acceleration);
        scale(rigid_body.VelocityIntegrated, rigid_body.VelocityIntegrated, rigid_body.Friction);
        rigid_body.VelocityIntegrated[1] += GRAVITY * delta;

        // Apply velocity to position.
        let vel_delta: Vec2 = [0, 0];
        scale(vel_delta, rigid_body.VelocityIntegrated, delta);
        add(transform.Translation, transform.Translation, vel_delta);
        game.World.Signature[entity] |= Has.Dirty;

        // Reset force/acceleration.
        set(rigid_body.Acceleration, 0, 0);
    }
}
