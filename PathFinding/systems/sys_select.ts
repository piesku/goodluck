import {Has} from "../components/com_index.js";
import {PickableFlag} from "../components/com_pickable.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Transform | Has.Pickable;

export function sys_select(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let pickable = game.World.Pickable[entity];

    if (pickable.Flags & PickableFlag.Selectable) {
        if (game.Pick?.EntityId === entity) {
            // XXX Highlight the selectable entity.

            // Select the entity.
            if (game.InputDelta["Mouse0"] === -1) {
                game.World.Mask[entity] |= Has.ControlPlayer;
            }
        } else {
            // XXX Remove highlight.

            // Deselect the entity.
            if (game.InputDelta["Mouse0"] === -1) {
                game.World.Mask[entity] &= ~Has.ControlPlayer;
            }
        }
    }
}
