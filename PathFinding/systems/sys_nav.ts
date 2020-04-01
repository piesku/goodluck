import {Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {path_find} from "../pathfind.js";

const QUERY = Has.Transform | Has.NavAgent;

export function sys_nav(game: Game, delta: number) {
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let agent = game.World.NavAgent[entity];
    if (agent.Goal !== undefined) {
        console.time("path_find");
        let path = path_find(agent.NavMesh, agent.Origin, agent.Goal);
        console.timeEnd("path_find");
        if (path) {
            // XXX centroids are in the world space, so we're good for now
            let waypoints = [...path].map((x) => agent.NavMesh.Centroids[x]);
            console.log({waypoints});
        }
        agent.Goal = undefined;
    }
}
