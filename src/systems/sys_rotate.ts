import {ROTATE, TRANSFORM} from "../components/com_index.js";
import {Rotate} from "../components/com_rotate.js";
import {Transform} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {from_euler, multiply} from "../math/quat.js";

const MASK = TRANSFORM | ROTATE;

export default function sys_rotate(game: Game, delta: number) {
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & MASK) === MASK) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let transform = game[TRANSFORM][entity] as Transform;
    let {x, y, z} = game[ROTATE][entity] as Rotate;
    let rotation = from_euler([], x * delta, y * delta, z * delta);
    transform.rotation = multiply(transform.rotation, rotation, transform.rotation);
    transform.dirty = true;
}
