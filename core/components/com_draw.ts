/**
 * @module components/com_draw
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export type Draw = DrawText | DrawRect | DrawArc | DrawSelection;

export const enum DrawKind {
    Text,
    Rect,
    Arc,
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
    Color: string;
    Width: number;
    Height: number;
}

export function draw_rect(color: string, width = 1, height = 1) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Draw;
        game.World.Draw[entity] = {
            Kind: DrawKind.Rect,
            Color: color,
            Width: width,
            Height: height,
        };
    };
}

export interface DrawArc {
    Kind: DrawKind.Arc;
    Color: string;
    Radius: number;
    StartAngle: number;
    EndAngle: number;
}

export function draw_arc(color: string, radius: number, start_angle = 0, end_angle = Math.PI * 2) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Draw;
        game.World.Draw[entity] = {
            Kind: DrawKind.Arc,
            Color: color,
            Radius: radius,
            StartAngle: start_angle,
            EndAngle: end_angle,
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
