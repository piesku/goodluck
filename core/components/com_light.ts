/**
 * @module components/com_light
 */

import {Vec3} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {LightKind} from "../../materials/light.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export type Light = LightAmbient | LightDirectional | LightPoint;

export interface LightAmbient {
    Kind: LightKind.Ambient;
    Color: Vec3;
    Intensity: number;
}

/**
 * Add the {@link LightAmbient} component to an entity.
 *
 * Ambient lights are only supported in sys_render_deferred. The entity's
 * transform is ignored during shading.
 * @param color The color of the light.
 * @param intensity The intensity of the light, multiplied by the color.
 */
export function light_ambient(color: Vec3 = [1, 1, 1], intensity: number = 0.2) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Light;
        game.World.Light[entity] = {
            Kind: LightKind.Ambient,
            Color: color,
            Intensity: intensity,
        };
    };
}

export interface LightDirectional {
    Kind: LightKind.Directional;
    Color: Vec3;
    Intensity: number;
}

/**
 * Add the {@link LightDirectional} component to an entity.
 *
 * The position of directional lights is ignored during shading. The direction
 * in which the light shines is _the opposite_ of the forward vector of the
 * entity's transform. In other words, directional lights shine backwards. This
 * is done for consistency with the way cameras look at the scene. Add a depth
 * camera components to the directional light to make it a shadow source.
 * @param color The color of the light.
 * @param intensity The intensity of the light, multiplied by the color.
 */
export function light_directional(color: Vec3 = [1, 1, 1], intensity: number = 1) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Light;
        game.World.Light[entity] = {
            Kind: LightKind.Directional,
            Color: color,
            Intensity: intensity,
        };
    };
}

export interface LightPoint {
    Kind: LightKind.Point;
    Color: Vec3;
    Intensity: number;
}

/**
 * Add the {@link LightPoint} component to an entity.
 *
 * The position of the entity is used as the position of the light during shading.
 * @param color The color of the light.
 * @param intensity The intensity of the light at 1 world unit away. The
 * intensity of 1 results in 100% of the object's color being visible, adjusted for
 * the angle. The intensity is attenuated exponentially.
 */
export function light_point(color: Vec3 = [1, 1, 1], intensity: number = 1) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Light;
        game.World.Light[entity] = {
            Kind: LightKind.Point,
            Color: color,
            Intensity: intensity,
        };
    };
}

/**
 * Compute the radius of a light given the minimum desired intensity.
 * @param base_intensity The base intensity of the light.
 * @param min_intensity The minimum desired intensity at the computed radius.
 */
export function light_radius(base_intensity: number, min_intensity: number = 0.005) {
    return (base_intensity / min_intensity) ** 0.5;
}
