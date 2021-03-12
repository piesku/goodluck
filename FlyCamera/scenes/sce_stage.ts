import {blueprint_camera_fly} from "../blueprints/blu_camera_fly.js";
import {children} from "../components/com_children.js";
import {draw_text} from "../components/com_draw.js";
import {light_directional} from "../components/com_light.js";
import {render_colored_diffuse} from "../components/com_render1.js";
import {transform} from "../components/com_transform.js";
import {instantiate} from "../entity.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [transform([1, 2, 5], [0, 1, 0, 0]), ...blueprint_camera_fly(game)]);

    // Light.
    instantiate(game, [transform([2, 3, 5]), light_directional([1, 1, 1], 1)]);

    // Ground.
    instantiate(game, [
        transform(undefined, undefined, [10, 1, 10]),
        render_colored_diffuse(game.MaterialColoredDiffuseGouraud, game.MeshCube, [1, 1, 0.3, 1]),
    ]);

    // Box.
    instantiate(game, [
        transform([0, 1, 0]),
        render_colored_diffuse(game.MaterialColoredDiffuseGouraud, game.MeshCube, [1, 1, 0.3, 1]),
        children([transform([0, 1, 0]), draw_text("Hello!", "10vmin sans", "#555")]),
    ]);
}
