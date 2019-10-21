import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export type Draw = DrawMarker;

export const enum DrawKind {
    Marker,
}

export interface DrawMarker {
    Kind: DrawKind.Marker;
    Marker: string;
}

export function draw_marker(Marker: string) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.Draw;
        game[Get.Draw][entity] = <Draw>{
            Kind: DrawKind.Marker,
            Marker,
        };
    };
}
