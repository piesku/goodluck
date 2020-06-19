import {from_euler} from "../../common/quat.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {collide} from "../components/com_collide.js";
import {control_player} from "../components/com_control_player.js";
import {draw_marker, draw_selection} from "../components/com_draw.js";
import {light_directional} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {nav_agent} from "../components/com_nav_agent.js";
import {pickable} from "../components/com_pickable.js";
import {render_basic} from "../components/com_render_basic.js";
import {render_diffuse} from "../components/com_render_diffuse.js";
import {selectable} from "../components/com_selectable.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {nav_bake} from "../navmesh.js";
import {Has, World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.Gl.clearColor(0.9, 0.9, 0.9, 1);

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

    // Terrain. For the nav mesh to work properly, it must be in the world space
    // and have the scale of 1.
    instantiate(game, {
        Using: [
            render_diffuse(game.MaterialDiffuseGouraud, game.MeshTerrain, [0.3, 0.3, 0.8, 1]),
            pickable(game.MeshTerrain),
            collide(false, [100, 1, 100]),
        ],
        Children: [
            {
                Translation: [0, 0.1, 0],
                Using: [render_basic(game.MaterialBasicLine, game.MeshTerrain, [0.4, 0.4, 0.8, 1])],
            },
        ],
    });

    console.time("nav_bake");
    // Bake the nav mesh; maximum walkable slope is 30°.
    let nav = nav_bake(game.MeshTerrain, Math.PI / 6);
    console.timeEnd("nav_bake");

    for (let node = 0; node < nav.Centroids.length; node++) {
        if (false && nav.Centroids[node]) {
            instantiate(game, {
                Translation: nav.Centroids[node],
                Using: [draw_marker(`${node}`)],
            });
        }
    }

    // Cube 1.
    instantiate(game, {
        Translation: [26, 1, 39],
        Using: [
            control_player(),
            pickable(),
            selectable(),
            collide(true, [2, 2, 2]),
            // The origin node must match the entity's translation.
            nav_agent(nav, 190),
            move(10, 10),
        ],
        Disable: Has.ControlPlayer,
        Children: [
            {
                Using: [draw_selection("#ff0")],
                Disable: Has.Draw,
            },
            {
                Scale: [2, 2, 2],
                Using: [render_diffuse(game.MaterialDiffuseGouraud, game.MeshCube, [1, 0, 0, 1])],
            },
        ],
    });

    // Cube 2.
    instantiate(game, {
        Translation: [-18, 1, -23],
        Using: [
            control_player(),
            pickable(),
            selectable(),
            collide(true, [2, 2, 2]),
            // The origin node must match the entity's translation.
            nav_agent(nav, 89),
            move(15, 15),
        ],
        Disable: Has.ControlPlayer,
        Children: [
            {
                Using: [draw_selection("#ff0")],
                Disable: Has.Draw,
            },
            {
                Scale: [2, 2, 2],
                Using: [render_diffuse(game.MaterialDiffuseGouraud, game.MeshCube, [0, 1, 0, 1])],
            },
        ],
    });
}
