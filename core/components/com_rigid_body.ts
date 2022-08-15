/**
 * # RigidBody
 *
 * The `RigidBody` component allows the entity to collide and interact with
 * other rigid bodies
 *
 * The physics simulation is simplified. Among others, it assumes mass = 1,
 * which means that acceleration and force are numerically equal.
 */

import {Vec3} from "../../lib/math.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export const enum RigidKind {
    Static,
    Dynamic,
    Kinematic,
}

export interface RigidBody {
    Kind: RigidKind;
    ColliderId: Entity;
    Bounciness: number;
    Acceleration: Vec3;
    VelocityLinear: Vec3;
    VelocityResolved: Vec3;
    LastPosition: Vec3;
    IsGrounded: boolean;
}

/**
 * Add `RigidBody` to an entity.
 *
 * @param kind The type of the rigid body (static, dynamic, kinematic).
 * @param bounciness Bounciness of the rigid body (0 = no bounce, 1 = full bounce).
 */
export function rigid_body(kind: RigidKind, bounciness = 0.5) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.RigidBody;
        game.World.RigidBody[entity] = {
            Kind: kind,
            ColliderId: entity,
            Bounciness: bounciness,
            Acceleration: [0, 0, 0],
            VelocityLinear: [0, 0, 0],
            VelocityResolved: [0, 0, 0],
            LastPosition: [0, 0, 0],
            IsGrounded: false,
        };
    };
}
