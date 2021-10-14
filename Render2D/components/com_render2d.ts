import {Vec4} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Render2D {
    Color: Vec4;
}

export function render2d(color: Vec4) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Render2D;
        game.World.Render2D[entity] = {
            Color: color,
        };
    };
}
