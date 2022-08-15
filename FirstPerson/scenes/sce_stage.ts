import {instantiate} from "../../lib/game.js";
import {blueprint_camera_fly} from "../blueprints/blu_camera_fly.js";
import {children} from "../components/com_children.js";
import {draw_text} from "../components/com_draw.js";
import {light_directional} from "../components/com_light.js";
import {render_colored_shaded} from "../components/com_render.js";
import {set_position, set_rotation, set_scale, transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [
        ...blueprint_camera_fly(game),
        set_position(1, 2, 5),
        set_rotation(0, 180, 0),
    ]);

    // Light.
    instantiate(game, [transform(), set_rotation(-30, 30, 0), light_directional([1, 1, 1], 0.5)]);

    // Ground.
    instantiate(game, [
        transform(),
        set_scale(10, 1, 10),
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 1, 0.3, 1]),
    ]);

    // Box.
    instantiate(game, [
        transform([0, 1, 0]),
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshCube, [1, 1, 0.3, 1]),
        children([transform([0, 1, 0]), draw_text("Hello!", "10vmin sans", "#555")]),
    ]);
}
