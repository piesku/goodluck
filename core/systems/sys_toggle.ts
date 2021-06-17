/**
 * @module systems/sys_toggle
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Toggle;

export function sys_toggle(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let toggle = game.World.Toggle[entity];

    toggle.SinceLast += delta;

    if (toggle.SinceLast > toggle.Frequency) {
        toggle.SinceLast = 0;
        if (toggle.CurrentlyEnabled) {
            toggle.CurrentlyEnabled = false;
            game.World.Signature[entity] &= ~toggle.Mask;
        } else {
            toggle.CurrentlyEnabled = true;
            game.World.Signature[entity] |= toggle.Mask;
        }
    }
}
