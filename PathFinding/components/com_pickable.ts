import {Mesh} from "../../common/material.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export interface Pickable {
    Flags: number;
    Mesh?: Mesh;
}

export const enum PickableFlag {
    None = 0,
    Selectable = 1,
}

export function pickable(flags: number, mesh?: Mesh) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Pickable;
        game.World.Pickable[entity] = {
            Flags: flags,
            Mesh: mesh,
        };
    };
}
