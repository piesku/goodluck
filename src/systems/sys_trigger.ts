import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Collide) | (1 << Get.Trigger);

export function sys_trigger(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    if (game[Get.Collide][entity].collisions.length > 0) {
        game.dispatch(game[Get.Trigger][entity].action, entity);
    }
}
