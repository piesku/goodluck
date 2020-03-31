import {Entity, Game} from "../game.js";
import {NavMesh} from "../navmesh.js";
import {Has} from "./com_index.js";

export interface NavAgent {
    NavMesh: NavMesh;
    Origin: number;
}

export function nav_agent(navmesh: NavMesh, tri: number) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.NavAgent;
        game.World.NavAgent[entity] = {
            NavMesh: navmesh,
            Origin: tri,
        };
    };
}
