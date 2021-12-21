/**
 * @module systems/sys_shake
 */

import {scale} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Shake;

export function sys_shake(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let shake = game.World.Shake[entity];
    let transform = game.World.Transform[entity];

    transform.Translation = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
    scale(transform.Translation, transform.Translation, shake.Magnitude * 2);
    game.World.Signature[entity] |= Has.Dirty;
}
