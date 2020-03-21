import {blueprint_camera} from "../blueprints/blu_camera.js";
import {render_textured} from "../components/com_render_textured.js";
import {rotate} from "../components/com_rotate.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.GL.clearColor(1, 1, 1, 1);

    // Camera.
    instantiate(game, {
        Translation: [0, 0, 2],
        ...blueprint_camera(game),
    });

    // Kulka.
    instantiate(game, {
        Translation: [0, 0, 0],
        Using: [
            render_textured(game.MaterialTextured, game.MeshKulka, game.Texture!),
            rotate([0, 20, 0]),
        ],
    });
}
