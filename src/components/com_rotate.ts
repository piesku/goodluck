import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Rotate {
    x: number;
    y: number;
    z: number;
}

export function rotate(x: number, y: number, z: number) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Rotate;
        game[Get.Rotate][entity] = <Rotate>{x, y, z};
    };
}
