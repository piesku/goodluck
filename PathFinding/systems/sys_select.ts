import {input_clicked} from "../../common/input.js";
import {Entity} from "../../common/world.js";
import {SelectedState} from "../components/com_selectable.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Selectable | Has.Children;

export function sys_select(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }

    game.Selected = undefined;
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            let selectable = game.World.Selectable[i];
            if (selectable.Selected) {
                game.Selected = i;
            }
        }
    }
}

function update(game: Game, entity: Entity) {
    let selectable = game.World.Selectable[entity];

    if (selectable.Selected === SelectedState.ThisFrame) {
        selectable.Selected = SelectedState.Currently;
    }

    if (input_clicked(game, 0, 0)) {
        // When the user left-clicks…

        if (game.Picked?.Entity === entity) {
            if (selectable.Selected === SelectedState.None) {
                // …select.
                selectable.Selected = SelectedState.ThisFrame;
                game.World.Signature[entity] |= Has.ControlPlayer;
            }
        } else if (selectable.Selected > SelectedState.None) {
            // …deselect.
            selectable.Selected = SelectedState.None;
            game.World.Signature[entity] &= ~Has.ControlPlayer;
        }
    } else if (input_clicked(game, 2, 1)) {
        // When the user right-clicks…

        if (selectable.Selected > SelectedState.None) {
            // …deselect.
            selectable.Selected = SelectedState.None;
            game.World.Signature[entity] &= ~Has.ControlPlayer;
        }
    }
}
