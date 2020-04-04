import {GL_ARRAY_BUFFER} from "../../common/webgl.js";
import {Has} from "../components/com_index.js";
import {RenderPath, render_path} from "../components/com_render_path.js";
import {instantiate} from "../core.js";
import {Entity, Game} from "../game.js";
import {path_find} from "../pathfind.js";

const QUERY = Has.ControlPlayer | Has.NavAgent;

let line: Entity;

export function sys_control_player(game: Game, delta: number) {
    if (!line) {
        line = instantiate(game, {
            Translation: [0, 1, 0],
            Using: [render_path(512, [1, 1, 0, 1])],
        });
    }

    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) == QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let agent = game.World.NavAgent[entity];
    let pick = game.Pick?.TriIndex;

    // Is the cursor over a pickable mesh and over a navigable triangle?
    let goal = pick && agent.NavMesh.Graph[pick] ? pick : undefined;

    if (game.InputDelta["Mouse0"] === 1) {
        agent.Goal = goal;
    }

    // The path line for debugging.
    if (goal !== undefined) {
        let path = path_find(agent.NavMesh, goal, agent.Origin);
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
    } else {
        game.World.Mask[line] &= ~Has.Render;
    }
}
