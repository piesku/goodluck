/**
 * @module components/com_rigid_body
 */

import {Vec3} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

// Assume mass = 1, which means that acceleration and force are numerically equal.

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
    VelocityIntegrated: Vec3;
    VelocityResolved: Vec3;
    LastPosition: Vec3;
    IsAirborne: boolean;
}

export function rigid_body(kind: RigidKind, bounciness = 0.5) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.RigidBody;
        game.World.RigidBody[entity] = {
            Kind: kind,
            ColliderId: entity,
            Bounciness: bounciness,
            Acceleration: [0, 0, 0],
            VelocityIntegrated: [0, 0, 0],
            VelocityResolved: [0, 0, 0],
            LastPosition: [0, 0, 0],
            IsAirborne: false,
        };
    };
}
