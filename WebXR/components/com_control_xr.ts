import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export const enum ControlXrKind {
    Head,
    Left,
    Right,
}

export interface ControlXr {
    Kind: ControlXrKind;
    Squeezed: boolean;
}

export function control_xr(kind: ControlXrKind) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlXr;
        game.World.ControlXr[entity] = {
            Kind: kind,
            Squeezed: false,
        };
    };
}
