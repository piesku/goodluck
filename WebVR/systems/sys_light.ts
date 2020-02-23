import {get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Transform | Has.Light;

export function sys_light(game: Game, delta: number) {
    game.LightPositions = [];
    game.LightDetails = [];

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

let world_pos: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity) {
    let light = game.World.Light[entity];
    let transform = game.World.Transform[entity];
    get_translation(world_pos, transform.World);
    game.LightPositions.push(world_pos[0], world_pos[1], world_pos[2]);
    game.LightDetails.push(light.Color[0], light.Color[1], light.Color[2], light.Intensity);
}
