import {get_translation} from "../../common/mat4.js";
import {Quat, Vec3} from "../../common/math.js";
import {rotation_to} from "../../common/quat.js";
import {distance_squared, normalize, transform_point} from "../../common/vec3.js";
import {Entity, Game} from "../game.js";
import {path_find} from "../pathfind.js";
import {Has} from "../world.js";

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
        // Search FROM the goal TO the origin, so that the waypoints are ordered
        // from the one closest to the origin.
        let path = path_find(agent.NavMesh, agent.Goal.Node, agent.Origin);
        console.timeEnd("path_find");

        if (path) {
            // Discard the first waypoint, which is always the origin node, and
            // the last waypoint, which is the goal's node.
            let waypoints = path.slice(1, path.length - 1);
            agent.Waypoints = waypoints.map((w) => ({
                Node: w,
                Position: agent.NavMesh.Centroids[w],
            }));
            // Add the destination's world position as the last waypoint. The
            // waypoint list has always at least one waypoint, which is
            // important for cases when the path is empty, i.e. the origin and
            // the goal were the same node.
            agent.Waypoints.push(agent.Goal);
        }
        agent.Goal = undefined;
    }

    if (agent.Waypoints) {
        let transform = game.World.Transform[entity];
        let position: Vec3 = [0, 0, 0];
        get_translation(position, transform.World);

        let current_waypoint = agent.Waypoints[0];
        let distance_to_current_waypoint = distance_squared(position, current_waypoint.Position);
        if (distance_to_current_waypoint < 1) {
            let origin = agent.Waypoints.shift();
            if (origin !== undefined) {
                agent.Origin = origin.Node;
            }
            if (agent.Waypoints.length === 0) {
                agent.Waypoints = undefined;
            }
        }

        // Transform the waypoint's position into the agent's self space which
        // is where sys_move runs.
        transform_point(position, current_waypoint.Position, transform.Self);
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
