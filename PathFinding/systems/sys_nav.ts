import {get_translation} from "../../common/mat4.js";
import {Quat, Vec3} from "../../common/math.js";
import {rotation_to} from "../../common/quat.js";
import {distance_squared, normalize, transform_point} from "../../common/vec3.js";
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

let look_target: Vec3 = [0, 0, 0];

function update(game: Game, entity: Entity) {
    let agent = game.World.NavAgent[entity];
    if (agent.Goal !== undefined) {
        console.time("path_find");
        // Search FROM the goal TO the origin, so that the first waypoint of the
        // path is the closest to the origin, i.e. it is in fact the first
        // waypoint for the agent to navigate through.
        let path = path_find(agent.NavMesh, agent.Goal, agent.Origin);
        console.timeEnd("path_find");
        if (path) {
            agent.Path = [...path];
        }
        agent.Goal = undefined;
    }

    if (agent.Path) {
        let transform = game.World.Transform[entity];
        let position: Vec3 = [0, 0, 0];
        get_translation(position, transform.World);

        let current_waypoint = agent.Path[0];
        // Centroids are in the world space; use them directly without further transformations.
        let current_waypoint_pos = agent.NavMesh.Centroids[current_waypoint];
        let distance_to_current_waypoint = distance_squared(position, current_waypoint_pos);

        if (distance_to_current_waypoint < 1) {
            agent.Origin = agent.Path.shift()!;
            if (agent.Path.length === 0) {
                agent.Path = undefined;
            }
        }

        // Transform the waypoint's position into the agent's self space which
        // is where sys_move runs.
        transform_point(position, current_waypoint_pos, transform.Self);
        normalize(position, position);

        // Project the waypoint's position onto the agent's self XZ plane.
        look_target[0] = position[0];
        look_target[2] = position[2];
        normalize(look_target, look_target);

        let yaw: Quat = [0, 0, 0, 0];
        rotation_to(yaw, [0, 0, 1], look_target);

        let move = game.World.Move[entity];
        move.Directions.push(position);
        move.LocalRotations.push(yaw);
    }
}
