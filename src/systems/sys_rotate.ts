import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {from_euler, multiply} from "../math/quat.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Rotate);

export function sys_rotate(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game[Get.Transform][entity];
    let {x, y, z} = game[Get.Rotate][entity];
    let rotation = from_euler([], x * delta, y * delta, z * delta);
    transform.rotation = multiply(transform.rotation, rotation, transform.rotation);
    transform.dirty = true;
}
