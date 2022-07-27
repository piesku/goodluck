import {Vec4} from "../../common/math.js";
import {map_range} from "../../common/number.js";
import {Entity} from "../../common/world.js";
import {FLOATS_PER_INSTANCE} from "../../materials/layout2d.js";
import {spritesheet} from "../../sprites/spritesheet.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Render2D {
    Detail: Float32Array;
    Color: Float32Array;
    Sprite: Float32Array;
}

export function render2d(sprite_name: string, color: Vec4 = [1, 1, 1, 1]) {
    return (game: Game, entity: Entity) => {
        let instance_offset = entity * FLOATS_PER_INSTANCE;
        // Detail.
        // Place entities from closest to the farthest away to avoid overdraw.
        game.InstanceData[instance_offset + 6] = map_range(entity, 0, game.World.Capacity, 1, 0);
        game.InstanceData[instance_offset + 7] = 1; // Has.Render2D
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

export function order(z: number) {
    return (game: Game, entity: Entity) => {
        let instance_offset = entity * FLOATS_PER_INSTANCE;
        game.InstanceData[instance_offset + 6] = z;
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
