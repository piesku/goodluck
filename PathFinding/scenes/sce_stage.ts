import {from_euler} from "../../common/quat.js";
import {integer, set_seed} from "../../common/random.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {draw_marker} from "../components/com_draw.js";
import {light_directional} from "../components/com_light.js";
import {nav_agent} from "../components/com_nav_agent.js";
import {pickable} from "../components/com_pickable.js";
import {render_basic} from "../components/com_render_basic.js";
import {render_diffuse} from "../components/com_render_diffuse.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {nav_bake} from "../navmesh.js";
import {path_find} from "../pathfind.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.GL.clearColor(1, 1, 1, 1);

    // Camera.
    instantiate(game, {
        ...blueprint_camera(game),
        Translation: [0, 75, 55],
        Rotation: from_euler([0, 0, 0, 0], 60, 180, 0),
    });

    // Light.
    instantiate(game, {
        Translation: [-1, 1, 1],
        Using: [light_directional([1, 1, 1], 1.2)],
    });

    // Terrain.
    instantiate(game, {
        Using: [
            render_diffuse(game.MaterialDiffuseGouraud, game.MeshTerrain, [0.3, 0.3, 0.8, 1]),
            pickable(game.MeshTerrain),
        ],
        Children: [
            {
                Translation: [0, 0.1, 0],
                Using: [render_basic(game.MaterialBasicLine, game.MeshTerrain, [0.4, 0.4, 0.8, 1])],
            },
        ],
    });

    console.time("nav_bake");
    let nav = nav_bake(game.MeshTerrain);
    console.timeEnd("nav_bake");

    for (let face = 0; face < nav.Centroids.length; face++) {
        if (false && nav.Centroids[face]) {
            instantiate(game, {
                Translation: nav.Centroids[face],
                Using: [draw_marker(`${face}`)],
            });
        }
    }

    instantiate(game, {
        Translation: [26, 0, 39],
        Scale: [2, 2, 2],
        Using: [nav_agent(nav, 190)],
        Children: [
            {
                Using: [render_diffuse(game.MaterialDiffuseGouraud, game.MeshCube, [1, 0, 0, 1])],
            },
        ],
    });

    if (false) {
        set_seed(1234567890);
        console.time("bench");
        for (let i = 0; i < 10000; i++) {
            let a = integer(0, nav.Graph.length - 1);
            let b = integer(0, nav.Graph.length - 1);
            if (nav.Graph[a] && nav.Graph[b]) {
                path_find(nav, a, b);
            }
        }
        console.timeEnd("bench");
    }
}
