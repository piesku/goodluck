import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get, Has} from "./com_index.js";

export interface Light {
    EntityId: Entity;
    Color: Vec3;
    Intensity: number;
}

export function light(color: Vec3 = [1, 1, 1], range: number = 1) {
    return (game: Game, EntityId: Entity) => {
        game.World[EntityId] |= Has.Light;
        game[Get.Light][EntityId] = <Light>{
            EntityId,
            Color: color,
            Intensity: range ** 2,
        };
    };
}
