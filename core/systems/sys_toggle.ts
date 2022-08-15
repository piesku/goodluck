/**
 * # sys_toggle
 *
 * Enable and disable the entity's other components periodically.
 */

import {Entity} from "../../lib/world.js";
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
        if ((game.World.Signature[entity] & toggle.Mask) === toggle.Mask) {
            game.World.Signature[entity] &= ~toggle.Mask;
        } else {
            game.World.Signature[entity] |= toggle.Mask;
        }
    }
}
