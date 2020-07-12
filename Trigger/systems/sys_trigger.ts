import {dispatch} from "../actions.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Collide | Has.Trigger;

export function sys_trigger(game: Game, delta: number) {
    for (let i = 0; i < game.World.Components.length; i++) {
        if ((game.World.Components[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let collide = game.World.Collide[entity];
    let trigger = game.World.Trigger[entity];
    for (let collision of collide.Collisions) {
        dispatch(game, trigger.Action, [entity, collision.Other]);
    }
}
