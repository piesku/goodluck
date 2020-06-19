import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export type Draw = DrawText | DrawSelection;

export const enum DrawKind {
    Text,
    Selection,
}

export interface DrawText {
    Kind: DrawKind.Text;
    Text: string;
}

export function draw_marker(Marker: string) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Draw;
        game.World.Draw[entity] = {
            Kind: DrawKind.Text,
            Text: Marker,
        };
    };
}

export interface DrawSelection {
    Kind: DrawKind.Selection;
    Color: string;
}

export function draw_selection(color: string) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Draw;
        game.World.Draw[entity] = {
            Kind: DrawKind.Selection,
            Color: color,
        };
    };
}
