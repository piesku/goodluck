/**
 * @module components/com_draw
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export type Draw = DrawText | DrawRect | DrawSelection;

export const enum DrawKind {
    Text,
    Rect,
    Selection,
}

export interface DrawText {
    Kind: DrawKind.Text;
    Text: string;
    Font: string;
    FillStyle: string;
}

export function draw_text(text: string, font: string, fill_style: string) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Draw;
        game.World.Draw[entity] = {
            Kind: DrawKind.Text,
            Text: text,
            Font: font,
            FillStyle: fill_style,
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
        game.World.Signature[entity] |= Has.Draw;
        game.World.Draw[entity] = {
            Kind: DrawKind.Rect,
            Width,
            Height,
            Color,
        };
    };
}

export interface DrawSelection {
    Kind: DrawKind.Selection;
    Color: string;
    Size: number;
}

export function draw_selection(color: string) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Draw;
        game.World.Draw[entity] = {
            Kind: DrawKind.Selection,
            Color: color,
            // Set in sys_highlight.
            Size: 0,
        };
    };
}
