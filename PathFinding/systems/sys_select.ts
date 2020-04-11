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
    let transform = game.World.Transform[entity];

    if (game.Pick?.EntityId === entity) {
        // Highlight the selectable entity.
        transform.Scale[0] = 2;
        transform.Scale[1] = 2;
        transform.Scale[2] = 2;
        transform.Dirty = true;

        // Select the entity.
        if (game.InputDelta["Mouse0"] === -1) {
            console.log(`Selected ${entity}`);
            game.World.Mask[entity] |= Has.ControlPlayer;
        }
    } else {
        // Remove highlight.
        transform.Scale[0] = 1;
        transform.Scale[1] = 1;
        transform.Scale[2] = 1;
        transform.Dirty = true;

        // Deselect the entity.
        if (game.InputDelta["Mouse0"] === -1) {
            console.log(`Deselected ${entity}`);
            game.World.Mask[entity] &= ~Has.ControlPlayer;
        }
    }
}
