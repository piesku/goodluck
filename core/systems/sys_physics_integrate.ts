/**
 * @module systems/sys_physics_integrate
 */

import {Vec3} from "../../common/math.js";
import {add, copy, scale, set} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
import {RigidKind} from "../components/com_rigid_body.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.RigidBody;
const GRAVITY = -9.81;

export function sys_physics_integrate(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform[entity];
    let rigid_body = game.World.RigidBody[entity];

    if (rigid_body.Kind === RigidKind.Dynamic) {
        copy(rigid_body.VelocityIntegrated, rigid_body.VelocityResolved);

        // Compute change to velocity, including the gravity.
        scale(rigid_body.Acceleration, rigid_body.Acceleration, delta);
        add(rigid_body.VelocityIntegrated, rigid_body.VelocityIntegrated, rigid_body.Acceleration);
        rigid_body.VelocityIntegrated[1] += GRAVITY * delta;

        // Apply velocity to position.
        let vel_delta: Vec3 = [0, 0, 0];
        scale(vel_delta, rigid_body.VelocityIntegrated, delta);
        add(transform.Translation, transform.Translation, vel_delta);
        game.World.Signature[entity] |= Has.Dirty;

        // Reset force/acceleration.
        set(rigid_body.Acceleration, 0, 0, 0);
    }
}
