import {RaycastHit} from "../../common/raycast.js";
import {GL_ARRAY_BUFFER} from "../../common/webgl.js";
import {Has} from "../components/com_index.js";
import {RenderPath, render_path} from "../components/com_render_path.js";
import {instantiate} from "../core.js";
import {Entity, Game} from "../game.js";
import {path_find} from "../pathfind.js";

const QUERY = Has.Transform | Has.NavAgent;

let line: Entity;

export function sys_nav(game: Game, delta: number) {
    if (!game.Pick) {
        return;
    }

    if (!line) {
        line = instantiate(game, {
            Translation: [0, 1, 0],
            Using: [render_path(512, [1, 1, 0, 1])],
        });
    }

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) == QUERY) {
            update(game, i, game.Pick);
        }
    }
}

function update(game: Game, entity: Entity, pick: RaycastHit) {
    let agent = game.World.NavAgent[entity];

    let goal = pick.Tri;
    if (agent.NavMesh.Graph[goal] === undefined) {
        return;
    }

    console.time("path_find");
    let path = path_find(agent.NavMesh, agent.Origin, goal);
    console.timeEnd("path_find");

    if (path) {
        // XXX centroids are in the world space, so we're good for now
        let waypoints = [...path].map((x) => agent.NavMesh.Centroids[x]);

        game.World.Mask[line] |= Has.Render;
        let render = game.World.Render[line] as RenderPath;
        render.IndexCount = waypoints.length;
        game.GL.bindBuffer(GL_ARRAY_BUFFER, render.VertexBuffer);
        game.GL.bufferSubData(GL_ARRAY_BUFFER, 0, Float32Array.from(waypoints.flat()));
    } else {
        game.World.Mask[line] &= ~Has.Render;
    }
}
