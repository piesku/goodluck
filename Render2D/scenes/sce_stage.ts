import {instantiate} from "../../common/game.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {render2d} from "../components/com_render2d.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [...blueprint_camera(game), transform([0, 0, 5], [0, 1, 0, 0])]);

    instantiate(game, [transform([-2, 0, 0]), render2d([0, 1, 0, 1])]);

    instantiate(game, [transform([2, 0, 0]), render2d([0, 0, 1, 1])]);
}
