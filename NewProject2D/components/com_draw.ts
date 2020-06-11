import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export type Draw = DrawRect;

export const enum DrawKind {
    Rect,
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
        game.World.Draw[entity] = {
            Kind: DrawKind.Rect,
            Width,
            Height,
            Color,
        };
    };
}
