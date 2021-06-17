/**
 * @module components/com_light
 */

import {Vec3} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export type Light = LightDirectional | LightPoint;

export const enum LightKind {
    Inactive,
    Directional,
    Point,
}

export interface LightDirectional {
    Kind: LightKind.Directional;
    Color: Vec3;
    Intensity: number;
}

export function light_directional(color: Vec3 = [1, 1, 1], range: number = 1) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Light;
        game.World.Light[entity] = {
            Kind: LightKind.Directional,
            Color: color,
            Intensity: range ** 2,
        };
    };
}

export interface LightPoint {
    Kind: LightKind.Point;
    Color: Vec3;
    Intensity: number;
}

export function light_point(color: Vec3 = [1, 1, 1], range: number = 1) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Light;
        game.World.Light[entity] = {
            Kind: LightKind.Point,
            Color: color,
            Intensity: range ** 2,
        };
    };
}
