/**
 * @module systems/sys_light
 */

import {get_forward, get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {Entity} from "../../common/world.js";
import {LightKind} from "../../materials/light.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Light;

export function sys_light(game: Game, delta: number) {
    game.LightPositions.fill(0);
    game.LightDetails.fill(0);

    let counter = 0;
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, counter++);
        }
    }
}

let world_pos: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity, idx: number) {
    let light = game.World.Light[entity];
    let transform = game.World.Transform[entity];

    if (light.Kind === LightKind.Directional) {
        // Directional lights shine backwards, to match the way cameras work.
        // Rather than the light's world position, store the light's world normal.
        get_forward(world_pos, transform.World);
    } else {
        get_translation(world_pos, transform.World);
    }

    game.LightPositions[4 * idx + 0] = world_pos[0];
    game.LightPositions[4 * idx + 1] = world_pos[1];
    game.LightPositions[4 * idx + 2] = world_pos[2];
    game.LightPositions[4 * idx + 3] = light.Kind;
    game.LightDetails[4 * idx + 0] = light.Color[0];
    game.LightDetails[4 * idx + 1] = light.Color[1];
    game.LightDetails[4 * idx + 2] = light.Color[2];
    game.LightDetails[4 * idx + 3] = light.Intensity;
}
