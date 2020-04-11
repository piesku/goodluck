import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export function selectable() {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Selectable;
    };
}
