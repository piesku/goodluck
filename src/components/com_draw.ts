import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export type Draw = DrawMarker | DrawRect;

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

export interface DrawRect {
    Kind: DrawKind.Rect;
    Width: number;
    Height: number;
    Color: string;
}

export function draw_rect(Width: number, Height: number, Color: string) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Draw;
        game.World.Draw[entity] = <DrawRect>{
            Kind: DrawKind.Rect,
            Width,
            Height,
            Color,
        };
    };
}
