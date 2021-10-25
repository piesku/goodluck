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
        game.InstanceData.set(color, instance_offset + 20);

        game.World.Signature[entity] |= Has.Render2D;
        game.World.Render2D[entity] = {
            Detail: game.InstanceData.subarray(instance_offset + 16, instance_offset + 20),
            Color: game.InstanceData.subarray(instance_offset + 20, instance_offset + 24),
        };
    };
}
