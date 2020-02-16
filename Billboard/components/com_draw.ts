import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export type Draw = DrawMarker;

export const enum DrawKind {
    Marker,
    Rect,
}

export interface DrawMarker {
    Kind: DrawKind.Marker;
    Marker: string;
}

export function draw_marker(Marker: string) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Draw;
        game.World.Draw[entity] = <DrawMarker>{
            Kind: DrawKind.Marker,
            Marker,
        };
    };
}
