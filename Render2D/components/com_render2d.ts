import {Vec4} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {FLOATS_PER_INSTANCE, Game} from "../game.js";
import {Has} from "../world.js";

export interface Render2D {
    Detail: Float32Array;
    Color: Float32Array;
}

export function render2d(color: Vec4) {
    return (game: Game, entity: Entity) => {
        let instance_offset = entity * FLOATS_PER_INSTANCE;
        game.InstanceData[instance_offset + 6] = 0;
        game.InstanceData[instance_offset + 7] = 1; // Has.Render2D
        game.InstanceData[instance_offset + 8] = color[0];
        game.InstanceData[instance_offset + 9] = color[1];
        game.InstanceData[instance_offset + 10] = color[2];
        game.InstanceData[instance_offset + 11] = color[3];

        game.World.Signature[entity] |= Has.Render2D;
        game.World.Render2D[entity] = {
            Detail: game.InstanceData.subarray(instance_offset + 6, instance_offset + 8),
            Color: game.InstanceData.subarray(instance_offset + 8, instance_offset + 12),
        };
    };
}

export function order(z: number) {
    return (game: Game, entity: Entity) => {
        let instance_offset = entity * FLOATS_PER_INSTANCE;
        game.InstanceData[instance_offset + 6] = z;
    };
}
