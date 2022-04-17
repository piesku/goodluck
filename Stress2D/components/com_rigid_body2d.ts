/**
 * @module components/com_rigid_body
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
    Acceleration: Vec2;
    VelocityIntegrated: Vec2;
}

export function rigid_body2d(kind: RigidKind, friction: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.RigidBody2D;
        game.World.RigidBody2D[entity] = {
            Kind: kind,
            Friction: friction,
            Acceleration: [0, 0],
            VelocityIntegrated: [0, 0],
        };
    };
}
