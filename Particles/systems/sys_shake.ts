import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Shake;

export function sys_shake(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let shake = game.World.Shake[entity];

    if (shake.Duration > 0) {
        shake.Duration -= delta;

        let transform = game.World.Transform[entity];
        transform.Translation = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
        transform.Dirty = true;

        if (shake.Duration <= 0) {
            shake.Duration = 0;
            transform.Translation = [0, 0, 0];
        }
    }
}
