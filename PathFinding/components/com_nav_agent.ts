import {Vec3} from "../../common/math.js";
import {NavMesh} from "../../common/navmesh.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface NavAgent {
    NavMesh: NavMesh;
    Origin: number;
    Goal?: NavDestination;
    Waypoints?: Array<NavDestination>;
}

export interface NavDestination {
    Node: number;
    Position: Vec3;
}

/**
 * The NavAgent mixin.
 *
 * @param navmesh - The navmesh used for path finding.
 * @param origin - The node of the path finding graph that this entity is
 * currently at.
 */
export function nav_agent(navmesh: NavMesh, origin: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.NavAgent;
        game.World.NavAgent[entity] = {
            NavMesh: navmesh,
            Origin: origin,
        };
    };
}
