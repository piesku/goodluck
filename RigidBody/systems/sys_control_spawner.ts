import {get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {float} from "../../common/random.js";
import {blueprint_box} from "../blueprints/blu_box.js";
import {instantiate} from "../core.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.ControlSpawner;

export function sys_control_spawner(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

let world_pos: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity, delta: number) {
    let control = game.World.ControlSpawner[entity];
    control.SinceLast += delta;
    if (control.SinceLast > control.Frequency) {
        control.SinceLast = 0;

        // Randomize the spawn position.
        let transform = game.World.Transform[entity];
        get_translation(world_pos, transform.World);
        world_pos[0] += float(-control.Spread, control.Spread);
        world_pos[2] += float(-control.Spread, control.Spread);

        instantiate(game, {
            ...blueprint_box(game),
            Translation: [world_pos[0], world_pos[1], world_pos[2]],
        });
    }
}
