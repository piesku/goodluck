/**
 * # RigidBody2D
 *
 * The `RigidBody2D` component allows the entity to collide and interact with
 * other rigid bodies
 *
 * The physics simulation is simplified. Among others, it assumes mass = 1,
 * which means that acceleration and force are numerically equal.
 */

import {Vec2} from "../../lib/math.js";
import {clamp} from "../../lib/number.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export const enum RigidKind {
    Static,
    Dynamic,
}

export interface RigidBody2D {
    Kind: RigidKind;
    Drag: number;
    Bounciness: number;
    Acceleration: Vec2;
    VelocityLinear: Vec2;
    VelocityResolved: Vec2;
    VelocityAngular: number;
    IsGrounded: boolean;
}

/**
 * Add `RigidBody2D` to an entity.
 *
 * @param kind The type of the rigid body (static, dynamic).
 * @param bounciness Bounciness factor (0 = no bounce, 1 = full bounce).
 * @param drag Drag factor (0 = no drag, 1 = entity never moves).
 */
export function rigid_body2d(kind: RigidKind, bounciness = 1, drag = 0.001) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.RigidBody2D;
        game.World.RigidBody2D[entity] = {
            Kind: kind,
            Drag: clamp(0, 1, drag),
            Bounciness: clamp(0, 1, bounciness),
            Acceleration: [0, 0],
            VelocityLinear: [0, 0],
            VelocityResolved: [0, 0],
            VelocityAngular: 0,
            IsGrounded: false,
        };
    };
}
