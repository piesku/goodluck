import {instantiate} from "../../common/game.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_flame_colored} from "../blueprints/blu_flame_colored.js";
import {blueprint_flame_textured} from "../blueprints/blu_flame_textured.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;
    game.Gl.clearColor(0.9, 0.9, 0.9, 1);

    // Camera.
    instantiate(game, [...blueprint_camera(game), transform([0, 3, 10], [0, 1, 0, 0])]);

    // Colored flame.
    instantiate(game, [
        ...blueprint_flame_colored(game),
        transform(undefined, undefined, [5, 1, 1]),
    ]);

    // Textured flame.
    instantiate(game, [
        ...blueprint_flame_textured(game),
        transform(undefined, undefined, [5, 1, 1]),
    ]);
}
