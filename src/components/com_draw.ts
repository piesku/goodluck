import {Drawing} from "../drawings/dra_common.js";
import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface Draw {
    Drawing: Drawing;
    Arg?: unknown;
}

export function draw(Drawing: Drawing, Arg?: unknown) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.Draw;
        game[Get.Draw][entity] = <Draw>{
            Drawing,
            Arg,
        };
    };
}
