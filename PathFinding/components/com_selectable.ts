import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface Selectable {
    Highlighted: boolean;
    Selected: boolean;
}

export function selectable() {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Selectable;
        game.World.Selectable[entity] = {
            Highlighted: false,
            Selected: false,
        };
    };
}
