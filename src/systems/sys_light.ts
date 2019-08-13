import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Light);

export function sys_light(game: Game, delta: number) {
    game.lights = [];

    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    game.lights.push(game[Get.Light][entity]);
}
