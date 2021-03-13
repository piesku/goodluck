import {get_rotation, get_translation} from "../../common/mat4.js";
import {Quat, Vec3} from "../../common/math.js";
import {blueprint_box} from "../blueprints/blu_box.js";
import {transform} from "../components/com_transform.js";
import {instantiate} from "../entity.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.ControlSpawn;

export function sys_control_spawn(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let control = game.World.ControlSpawn[entity];

    control.SinceLast += delta;
    if (control.SinceLast > control.Frequency) {
        control.SinceLast = 0;

        let entity_transform = game.World.Transform[entity];
        let world_position: Vec3 = [0, 0, 0];
        get_translation(world_position, entity_transform.World);
        let world_rotation: Quat = [0, 0, 0, 0];
        get_rotation(world_rotation, entity_transform.World);

        instantiate(game, [...blueprint_box(game), transform(world_position, world_rotation)]);
    }
}
