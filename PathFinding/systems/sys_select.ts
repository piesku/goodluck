import {Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Transform | Has.Selectable;

export function sys_select(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    if (game.Pick?.EntityId === entity) {
        // XXX Highlight the selectable entity.

        // Select the entity.
        if (game.InputDelta["Mouse0"] === -1) {
            console.log(`Selected ${entity}`);
            game.World.Mask[entity] |= Has.ControlPlayer;
        }
    } else {
        // XXX Remove highlight.

        // Deselect the entity.
        if (game.InputDelta["Mouse0"] === -1) {
            console.log(`Deselected ${entity}`);
            game.World.Mask[entity] &= ~Has.ControlPlayer;
        }
    }
}
