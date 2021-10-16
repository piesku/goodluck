import {Vec4} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Render2D {
    Color: Float32Array;
}

export function render2d(color: Vec4) {
    return (game: Game, entity: Entity) => {
        game.InstanceData.set(color, entity * 20 + 16);

        game.World.Signature[entity] |= Has.Render2D;
        game.World.Render2D[entity] = {
            Color: game.InstanceData.subarray(entity * 20 + 16, entity * 20 + 20),
        };
    };
}
