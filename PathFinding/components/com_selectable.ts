import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface Selectable {
    Selected: SelectedState;
}

export const enum SelectedState {
    None,
    ThisFrame,
    Currently,
}

export function selectable() {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Selectable;
        game.World.Selectable[entity] = {
            Selected: SelectedState.None,
        };
    };
}
