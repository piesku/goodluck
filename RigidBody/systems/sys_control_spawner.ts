import {get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {float} from "../../common/random.js";
import {blueprint_box} from "../blueprints/blu_box.js";
import {transform} from "../components/com_transform.js";
import {instantiate} from "../entity.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.ControlSpawner;

export function sys_control_spawner(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let control = game.World.ControlSpawner[entity];
    control.SinceLast += delta;
    if (control.SinceLast > control.Frequency) {
        control.SinceLast = 0;

        // Randomize the spawn position.
        let entity_transform = game.World.Transform[entity];
        let world_position: Vec3 = [0, 0, 0];
        get_translation(world_position, entity_transform.World);
        world_position[0] += float(-control.Spread, control.Spread);
        world_position[2] += float(-control.Spread, control.Spread);
        instantiate(game, [...blueprint_box(game), transform(world_position)]);
    }
}
