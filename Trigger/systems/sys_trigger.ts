import {dispatch} from "../actions.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Collide | Has.Trigger;

export function sys_trigger(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    if (game.World.Collide[entity].Collisions.length > 0) {
        dispatch(game, game.World.Trigger[entity].Action, [entity]);
    }
}
