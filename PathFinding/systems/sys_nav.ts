import {mat4_get_translation} from "../../lib/mat4.js";
import {Vec3} from "../../lib/math.js";
import {path_find} from "../../lib/pathfind.js";
import {quat_multiply} from "../../lib/quat.js";
import {
    vec3_add,
    vec3_distance_squared,
    vec3_normalize,
    vec3_transform_position,
} from "../../lib/vec3.js";
import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.NavAgent | Has.Move;

export function sys_nav(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }
}

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
        mat4_get_translation(position, transform.World);

        let current_waypoint = agent.Waypoints[0];
        let distance_to_current_waypoint = vec3_distance_squared(
            position,
            current_waypoint.Position,
        );
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
        vec3_transform_position(position, current_waypoint.Position, transform.Self);
        vec3_normalize(position, position);

        let move = game.World.Move[entity];
        vec3_add(move.Direction, move.Direction, position);

        if (position[0] < 0) {
            // The target is on the right.
            quat_multiply(transform.Rotation, move.LocalRotation, [0, -1, 0, 0]);
        } else {
            // The target is on the left or directly behind.
            quat_multiply(transform.Rotation, move.LocalRotation, [0, 1, 0, 0]);
        }
    }
}
