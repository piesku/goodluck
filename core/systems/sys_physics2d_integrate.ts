/**
 * @module systems/sys_physics2d_integrate
 */

import {Vec2} from "../../common/math.js";
import {add, scale, set} from "../../common/vec2.js";
import {Entity} from "../../common/world.js";
import {RigidKind} from "../components/com_rigid_body2d.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.LocalTransform2D | Has.RigidBody2D;
const GRAVITY = -9.8;
const MOBILITY = 0.999;

export function sys_physics2d_integrate(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

let velocity_delta: Vec2 = [0, 0];

function update(game: Game, entity: Entity, delta: number) {
    let local = game.World.LocalTransform2D[entity];
    let rigid_body = game.World.RigidBody2D[entity];

    if (rigid_body.Kind === RigidKind.Dynamic) {
        // Compute change to velocity due to the gravity.
        rigid_body.VelocityIntegrated[1] += GRAVITY * delta;
        // Compute change to velocity due to external forces.
        scale(rigid_body.Acceleration, rigid_body.Acceleration, delta);
        add(rigid_body.VelocityIntegrated, rigid_body.VelocityIntegrated, rigid_body.Acceleration);
        // Apply friction.
        scale(
            rigid_body.VelocityIntegrated,
            rigid_body.VelocityIntegrated,
            MOBILITY - rigid_body.Friction
        );

        // Apply velocity to position.
        scale(velocity_delta, rigid_body.VelocityIntegrated, delta);
        add(local.Translation, local.Translation, velocity_delta);
        local.Rotation += rigid_body.VelocityAngular * delta;
        game.World.Signature[entity] |= Has.Dirty;

        // Reset force/acceleration.
        set(rigid_body.Acceleration, 0, 0);
    }
}
