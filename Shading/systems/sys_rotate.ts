import {Quat, Vec3} from "../../common/math.js";
import {from_euler, multiply} from "../../common/quat.js";
import {scale} from "../../common/vec3.js";
import {Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Transform | Has.Rotate;

export function sys_rotate(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

let euler: Vec3 = [0, 0, 0];
let quat: Quat = [0, 0, 0, 1];

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform[entity];
    let rotate = game.World.Rotate[entity];
    scale(euler, rotate.Rotation, delta);
    from_euler(quat, ...euler);
    multiply(transform.Rotation, quat, transform.Rotation);
    transform.Dirty = true;
}
