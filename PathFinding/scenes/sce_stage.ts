import {from_euler} from "../../common/quat.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional} from "../components/com_light.js";
import {render_basic} from "../components/com_render_basic.js";
import {render_diffuse} from "../components/com_render_diffuse.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {nav_bake} from "../navmesh.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.GL.clearColor(1, 1, 1, 1);

    // Camera.
    instantiate(game, {
        ...blueprint_camera(game),
        Translation: [0, 100, 0],
        Rotation: from_euler([0, 0, 0, 0], 90, 180, 0),
    });

    // Light.
    instantiate(game, {
        Translation: [1, 1, 1],
        Using: [light_directional([1, 1, 1], 1)],
    });

    instantiate(game, {
        Using: [render_diffuse(game.MaterialDiffuseGouraud, game.MeshTerrain, [0.3, 0.9, 0.9, 1])],
    });

    instantiate(game, {
        Translation: [0, 0.3, 0],
        Using: [render_basic(game.MaterialBasicWireframe, game.MeshNavmesh, [1, 1, 0, 1])],
    });

    console.log(nav_bake(game.MeshNavmesh));
}
