/**
 * @module systems/sys_shake2d
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform2D | Has.Shake;

export function sys_shake2d(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let shake = game.World.Shake[entity];
    let transform = game.World.Transform2D[entity];

    transform.Translation[0] = (Math.random() - 0.5) * shake.Magnitude * 2;
    transform.Translation[1] = (Math.random() - 0.5) * shake.Magnitude * 2;
    game.World.Signature[entity] |= Has.Dirty;
}
