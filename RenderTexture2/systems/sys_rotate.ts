import {Quat} from "../../common/math.js";
import {from_euler, multiply} from "../../common/quat.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Rotate;

export function sys_rotate(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

let rotation_delta: Quat = [0, 0, 0, 1];

function update(game: Game, entity: Entity, delta: number) {
    let transform = game.World.Transform[entity];
    let rotate = game.World.Rotate[entity];
    from_euler(
        rotation_delta,
        rotate.Rotation[0] * delta,
        rotate.Rotation[1] * delta,
        rotate.Rotation[2] * delta
    );
    multiply(transform.Rotation, rotation_delta, transform.Rotation);
    transform.Dirty = true;
}
