import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_flame_colored} from "../blueprints/blu_flame_colored.js";
import {blueprint_flame_textured} from "../blueprints/blu_flame_textured.js";
import {instantiate3d} from "../entity.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;
    game.Gl.clearColor(0.9, 0.9, 0.9, 1);

    // Camera.
    instantiate3d(game, {
        Translation: [0, 3, 10],
        ...blueprint_camera(game),
    });

    // Colored flame.
    instantiate3d(game, {
        Scale: [5, 1, 1],
        ...blueprint_flame_colored(game),
    });

    // Textured flame.
    instantiate3d(game, {
        Scale: [5, 1, 1],
        ...blueprint_flame_textured(game),
    });
}
