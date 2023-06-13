/**
 * # sys_spawn
 *
 * Instantiate blueprints into the world periodically. Spawned entities inherit
 * the spawner's position and rotation.
 */

import {instantiate} from "../../lib/game.js";
import {mat4_get_rotation, mat4_get_translation} from "../../lib/mat4.js";
import {Quat, Vec3} from "../../lib/math.js";
import {Entity} from "../../lib/world.js";
import {copy_position, copy_rotation} from "../components/com_transform.js";
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

const world_position: Vec3 = [0, 0, 0];
const world_rotation: Quat = [0, 0, 0, 0];

function update(game: Game, entity: Entity, delta: number) {
    let spawn = game.World.Spawn[entity];

    spawn.SinceLast += delta;
    if (spawn.SinceLast > spawn.Interval) {
        spawn.SinceLast = 0;

        let entity_transform = game.World.Transform[entity];
        mat4_get_translation(world_position, entity_transform.World);
        mat4_get_rotation(world_rotation, entity_transform.World);

        instantiate(game, [
            ...spawn.Creator(game),
            copy_position(world_position),
            copy_rotation(world_rotation),
        ]);
    }
}
