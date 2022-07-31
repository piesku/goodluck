/**
 * @module components/com_rigid_body2d
 */

import {Vec2} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

// Assume mass = 1, which means that acceleration and force are numerically equal.

export const enum RigidKind {
    Static,
    Dynamic,
}

export interface RigidBody2D {
    Kind: RigidKind;
    Friction: number;
    Bounciness: number;
    Acceleration: Vec2;
    VelocityLinear: Vec2;
    VelocityResolved: Vec2;
    VelocityAngular: number;
    IsGrounded: boolean;
}

export function rigid_body2d(kind: RigidKind, bounciness = 1, friction = 0) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.RigidBody2D;
        game.World.RigidBody2D[entity] = {
            Kind: kind,
            Friction: friction,
            Bounciness: bounciness,
            Acceleration: [0, 0],
            VelocityLinear: [0, 0],
            VelocityResolved: [0, 0],
            VelocityAngular: 0,
            IsGrounded: false,
        };
    };
}
