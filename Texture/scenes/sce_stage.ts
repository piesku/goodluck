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
    game.Gl.clearColor(0.9, 0.9, 0.9, 1);

    // Camera.
    instantiate(game, {
        Translation: [0, 0, 3],
        ...blueprint_camera(game),
    });

    // Checker.
    instantiate(game, {
        Translation: [-1, 0, 0],
        Using: [
            render_textured(game.MaterialTextured, game.MeshKulka, game.Textures["checker1.png"]),
            rotate([0, 20, 0]),
        ],
    });

    // Kulka.
    instantiate(game, {
        Translation: [1, 0, 0],
        Using: [
            render_textured(game.MaterialTextured, game.MeshKulka, game.Textures["kulka.png"]),
            rotate([0, 20, 0]),
        ],
    });
}
