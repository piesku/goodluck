import {Entity, Game} from "../game.js";
import {NavMesh} from "../navmesh.js";
import {Has} from "./com_index.js";

export interface NavAgent {
    NavMesh: NavMesh;
    Origin: number;
    Goal?: number;
    Path?: Array<number>;
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
        game.World.Mask[entity] |= Has.NavAgent;
        game.World.NavAgent[entity] = {
            NavMesh: navmesh,
            Origin: origin,
        };
    };
}
