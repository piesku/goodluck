import {instantiate} from "../../common/game.js";
import {input_clicked} from "../../common/input.js";
import {get_translation} from "../../common/mat4.js";
import {path_find} from "../../common/pathfind.js";
import {GL_ARRAY_BUFFER} from "../../common/webgl.js";
import {Entity} from "../../common/world.js";
import {disable} from "../components/com_disable.js";
import {RenderVertices, render_vertices} from "../components/com_render.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Has} from "../world.js";
import {Picked} from "./sys_pick.js";

const QUERY = Has.ControlPlayer | Has.NavAgent;

let line: Entity;

export function sys_control_player(game: Game, delta: number) {
    if (!line) {
        line = instantiate(game, [
            transform([0, 1, 0]),
            render_vertices(game.MaterialColoredLine, 512, [1, 1, 0, 1]),
            disable(Has.Render),
        ]);
    }

    if (game.Picked) {
        for (let i = 0; i < game.World.Signature.length; i++) {
            if ((game.World.Signature[i] & QUERY) == QUERY) {
                update(game, i, game.Picked);
            }
        }
    }
}

function update(game: Game, entity: Entity, pick: Picked) {
    let agent = game.World.NavAgent[entity];
    let node = pick.TriIndex;
    let goal;

    if (node !== undefined && agent.NavMesh.Graph[node]) {
        // The cursor is over a pickable mesh and over a navigable triangle?
        goal = node;
        if (input_clicked(game, 0, 0)) {
            agent.Goal = {Node: goal, Position: pick.Point};
        }
    }

    // The path line for debugging.
    if (goal !== undefined) {
        let path = path_find(agent.NavMesh, goal, agent.Origin);
        if (path) {
            let transform = game.World.Transform[entity];
            let world_pos = get_translation([0, 0, 0], transform.World);

            // Remove the origin and the goal from the path.
            path = path.slice(1, path.length - 1);
            // Centroids are in the world space.
            let waypoints = path.map((x) => agent.NavMesh.Centroids[x]);
            // Add the entity's current position and the exact goal destination.
            waypoints = [world_pos, ...waypoints, pick.Point];

            game.World.Signature[line] |= Has.Render;
            let render = game.World.Render[line] as RenderVertices;
            render.IndexCount = waypoints.length;
            game.Gl.bindBuffer(GL_ARRAY_BUFFER, render.VertexBuffer);
            game.Gl.bufferSubData(GL_ARRAY_BUFFER, 0, Float32Array.from(waypoints.flat()));
        }
    }
}
