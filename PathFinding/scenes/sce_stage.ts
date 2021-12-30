import {instantiate} from "../../common/game.js";
import {nav_bake} from "../../common/navmesh.js";
import {from_euler} from "../../common/quat.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {children} from "../components/com_children.js";
import {collide} from "../components/com_collide.js";
import {control_player} from "../components/com_control_player.js";
import {disable} from "../components/com_disable.js";
import {draw_selection, draw_text} from "../components/com_draw.js";
import {light_directional} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {nav_agent} from "../components/com_nav_agent.js";
import {pickable_aabb, pickable_mesh} from "../components/com_pickable.js";
import {render_colored_shaded, render_colored_unlit} from "../components/com_render.js";
import {selectable} from "../components/com_selectable.js";
import {transform} from "../components/com_transform.js";
import {Game, Layer} from "../game.js";
import {Has, World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;
    game.Gl.clearColor(0.9, 0.9, 0.9, 1);

    // Camera.
    instantiate(game, [...blueprint_camera(game), transform([0, 0, 15], [0, 1, 0, 0])]);

    // Directional light.
    instantiate(game, [
        transform(undefined, from_euler([0, 0, 0, 1], -30, 30, 0)),
        light_directional([1, 1, 1], 1),
    ]);

    // Terrain. For the nav mesh to work properly, it must be in the world space
    // and have the scale of 1.
    instantiate(game, [
        transform(),
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshTerrain, [0.3, 0.3, 0.8, 1]),
        pickable_mesh(game.MeshTerrain),
        collide(false, Layer.None, Layer.None, [100, 1, 100]),
        children([
            transform([0, 0.1, 0]),
            render_colored_unlit(game.MaterialColoredLine, game.MeshTerrain, [0.4, 0.4, 0.8, 1]),
        ]),
    ]);

    console.time("nav_bake");
    // Bake the nav mesh; maximum walkable slope is 30°.
    let nav = nav_bake(game.MeshTerrain, Math.PI / 6);
    console.timeEnd("nav_bake");

    for (let node = 0; node < nav.Centroids.length; node++) {
        if (false && nav.Centroids[node]) {
            instantiate(game, [
                transform(nav.Centroids[node]),
                draw_text(`${node}`, "12px monospace", "#fff"),
            ]);
        }
    }

    // Cube 1.
    instantiate(game, [
        transform([26, 0, 39]),
        control_player(false, 0, 0),
        disable(Has.ControlPlayer),
        pickable_aabb([1, 0, 0, 1]),
        selectable(),
        collide(true, Layer.None, Layer.None, [2, 2, 2]),
        // The origin node must match the entity's translation.
        nav_agent(nav, 190),
        move(10, 5),
        children(
            [transform(), draw_selection("#ff0"), disable(Has.Draw)],
            [
                transform([0, 1, 0], undefined, [2, 2, 2]),
                render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 0, 0, 1]),
            ]
        ),
    ]);

    // Cube 2.
    instantiate(game, [
        transform([-18, 0, -23]),
        control_player(false, 0, 0),
        disable(Has.ControlPlayer),
        pickable_aabb([0, 1, 0, 1]),
        selectable(),
        collide(true, Layer.None, Layer.None, [2, 2, 2]),
        // The origin node must match the entity's translation.
        nav_agent(nav, 89),
        move(15, 10),
        children(
            [transform([0, 1, 0]), draw_selection("#ff0"), disable(Has.Draw)],
            [
                transform([0, 1, 0], undefined, [2, 2, 2]),
                render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [0, 1, 0, 1]),
            ]
        ),
    ]);
}
