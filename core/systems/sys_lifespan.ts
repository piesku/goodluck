import {destroy_entity} from "../entity.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Lifespan;

export function sys_lifespan(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let lifespan = game.World.Lifespan[entity];
    lifespan.Remaining -= delta;
    if (lifespan.Remaining < 0) {
        setTimeout(() => destroy_entity(game.World, entity));
    }
}
