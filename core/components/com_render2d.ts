/**
 * # Render2D
 *
 * The `Render2D` component allows an entity to be rendered in 2D space.
 */

import {Vec4} from "../../lib/math.js";
import {clamp} from "../../lib/number.js";
import {Entity} from "../../lib/world.js";
import {FLOATS_PER_INSTANCE} from "../../materials/layout2d.js";
import {spritesheet} from "../../sprites/spritesheet.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Render2D {
    Detail: Float32Array;
    Color: Float32Array;
    Sprite: Float32Array;
}

/**
 * Add `Render2D` to an entity.
 *
 * By default, the z-order is 0. Use `order()` to change it.
 *
 * @param sprite_name The name of the sprite to render.
 * @param color The tint of the sprite.
 */
export function render2d(sprite_name: string, color: Vec4 = [1, 1, 1, 1]) {
    return (game: Game, entity: Entity) => {
        let instance_offset = entity * FLOATS_PER_INSTANCE;
        // Detail.
        game.InstanceData[instance_offset + 6] = 0; // z-order.
        game.InstanceData[instance_offset + 7] = Has.Render2D; // signature.
        // Color.
        game.InstanceData[instance_offset + 8] = color[0];
        game.InstanceData[instance_offset + 9] = color[1];
        game.InstanceData[instance_offset + 10] = color[2];
        game.InstanceData[instance_offset + 11] = color[3];
        // Sprite.
        game.InstanceData[instance_offset + 12] = spritesheet[sprite_name].x;
        game.InstanceData[instance_offset + 13] = spritesheet[sprite_name].y;
        game.InstanceData[instance_offset + 14] = spritesheet[sprite_name].width;
        game.InstanceData[instance_offset + 15] = spritesheet[sprite_name].height;

        game.World.Signature[entity] |= Has.Render2D;
        game.World.Render2D[entity] = {
            Detail: game.InstanceData.subarray(instance_offset + 6, instance_offset + 8),
            Color: game.InstanceData.subarray(instance_offset + 8, instance_offset + 12),
            Sprite: game.InstanceData.subarray(instance_offset + 12, instance_offset + 16),
        };
    };
}

/**
 * Set the z-order of an entity.
 *
 * Camera2D's projection is set up with z-order +1 as the near plane and -1 as
 * the far plane. The z-order set by this mixin is clamped to the [-1, 1] range.
 * If you want to skip the sprite while rendering, remove `Has.Render2D` from its
 * signature.
 *
 * @param z The z-order of the sprite, clamped to [-1, 1].
 */
export function order(z: number) {
    return (game: Game, entity: Entity) => {
        let instance_offset = entity * FLOATS_PER_INSTANCE;
        game.InstanceData[instance_offset + 6] = clamp(-1, 1, z);
    };
}

export function set_sprite(game: Game, entity: Entity, sprite_name: string) {
    let instance_offset = entity * FLOATS_PER_INSTANCE;
    game.InstanceData[instance_offset + 12] = spritesheet[sprite_name].x;
    game.InstanceData[instance_offset + 13] = spritesheet[sprite_name].y;
    game.InstanceData[instance_offset + 14] = spritesheet[sprite_name].width;
    game.InstanceData[instance_offset + 15] = spritesheet[sprite_name].height;
}

export function set_color(game: Game, entity: Entity, color: Vec4) {
    let instance_offset = entity * FLOATS_PER_INSTANCE;
    game.InstanceData[instance_offset + 8] = color[0];
    game.InstanceData[instance_offset + 9] = color[1];
    game.InstanceData[instance_offset + 10] = color[2];
    game.InstanceData[instance_offset + 11] = color[3];
}
