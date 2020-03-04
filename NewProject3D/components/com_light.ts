import {Vec3} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export interface Light {
    Color: Vec3;
    Intensity: number;
}

export function light(color: Vec3 = [1, 1, 1], range: number = 1) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Light;
        game.World.Light[entity] = {
            Color: color,
            Intensity: range ** 2,
        };
    };
}
