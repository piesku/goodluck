/**
 * @module systems/sys_spawn
 */

import {instantiate} from "../../common/game.js";
import {get_rotation, get_translation} from "../../common/mat4.js";
import {Quat, Vec3} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Spawn;

export function sys_spawn(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let spawn = game.World.Spawn[entity];

    spawn.SinceLast += delta;
    if (spawn.SinceLast > spawn.Interval) {
        spawn.SinceLast = 0;

        let entity_transform = game.World.Transform[entity];
        let world_position: Vec3 = [0, 0, 0];
        get_translation(world_position, entity_transform.World);
        let world_rotation: Quat = [0, 0, 0, 0];
        get_rotation(world_rotation, entity_transform.World);

        instantiate(game, [...spawn.Creator(game), transform(world_position, world_rotation)]);
    }
}
