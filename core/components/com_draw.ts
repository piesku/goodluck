/**
 * # Draw
 *
 * The `Draw` component allows drawing 2D primitives like text and rectangles.
 *
 * When used with [`Transform`](com_transform.html), the 2D primitives are drawn
 * in the 3D world space at the position of the entity, always facing the
 * camera.
 *
 * When used with [`LocalTransform2D`](com_local_transform2d.html), they are
 * drawn in the 2D world space at the position of the entity.
 */

import {Entity} from "../../lib/world.js";
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

/**
 * Add `DrawText` to an entity.
 *
 * @param text The text to draw.
 * @param font CSS font style.
 * @param fill_style CSS fill style.
 */
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

/**
 * Add `DrawRect` to an entity.
 *
 * @param color CSS fill style.
 * @param width Width of the rectangle.
 * @param height Height of the rectangle.
 */
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

/**
 * Add `DrawArc` to an entity.
 *
 * @param color CSS fill style.
 * @param radius Radius of the arc.
 * @param start_angle Start angle of the arc.
 * @param end_angle End angle of the arc.
 */
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

/**
 * Add `DrawSelection` to an entity.
 *
 * Currently, `sys_draw` draws a square outline around the entity.
 *
 * @param color CSS fill style.
 */
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
