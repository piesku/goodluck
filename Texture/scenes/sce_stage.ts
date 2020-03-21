import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional} from "../components/com_light.js";
import {render_texture} from "../components/com_render_texture.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.GL.clearColor(1, 0.3, 0.3, 1);

    // Camera.
    instantiate(game, {
        Translation: [1, 2, 5],
        ...blueprint_camera(game),
    });

    // Light.
    instantiate(game, {
        Translation: [2, 3, 5],
        Using: [light_directional([1, 1, 1], 1)],
    });

    instantiate(game, {
        Translation: [0, 1, 0],
        Using: [render_texture(game.MaterialDiffuseGouraud, game.MeshKulka, game.Texture!)],
    });
}
