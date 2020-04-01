import {get_translation} from "../../common/mat4.js";
import {Vec3} from "../../common/math.js";
import {manhattan, normalize, subtract, transform_direction} from "../../common/vec3.js";
import {Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {path_find} from "../pathfind.js";

const QUERY = Has.Transform | Has.NavAgent | Has.Move;

export function sys_nav(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }
}

let world_pos: Vec3 = [0, 0, 0];
let direction: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity) {
    let agent = game.World.NavAgent[entity];
    if (agent.Goal !== undefined) {
        console.time("path_find");
        let path = path_find(agent.NavMesh, agent.Origin, agent.Goal);
        console.timeEnd("path_find");
        if (path) {
            agent.Path = [...path];
            console.log({path: agent.Path});
        }
        agent.Goal = undefined;
    }

    if (agent.Path) {
        let transform = game.World.Transform[entity];
        get_translation(world_pos, transform.World);

        let current_waypoint = agent.Path[agent.Path.length - 1];
        // XXX centroids are in the world space, so we're good for now
        let current_waypoint_pos = agent.NavMesh.Centroids[current_waypoint];
        let distance_to_current_waypoint = manhattan(world_pos, current_waypoint_pos);

        if (distance_to_current_waypoint < 1) {
            agent.Origin = agent.Path.pop()!;
            if (agent.Path.length === 0) {
                agent.Path = undefined;
            }
        }

        subtract(direction, current_waypoint_pos, world_pos);
        transform_direction(direction, direction, transform.Self);
        normalize(direction, direction);

        let move = game.World.Move[entity];
        move.Directions.push(direction);
    }
}
