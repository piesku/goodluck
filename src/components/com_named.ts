import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface Named {
    name: string;
}

export function named(name: string) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Named;
        game[Get.Named][entity] = <Named>{name};
    };
}

export function find_first(game: Game, name: string) {
    for (let i = 0; i < game[Get.Named].length; i++) {
        let named = game[Get.Named][i];
        if (named && named.name === name) {
            return i;
        }
    }
    throw `No entity named ${name}.`;
}
