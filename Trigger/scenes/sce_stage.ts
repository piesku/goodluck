import {instantiate} from "../../common/game.js";
import {Action} from "../actions.js";
import {blueprint_box} from "../blueprints/blu_box.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {children} from "../components/com_children.js";
import {collide} from "../components/com_collide.js";
import {control_always} from "../components/com_control_always.js";
import {light_directional} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {transform} from "../components/com_transform.js";
import {trigger} from "../components/com_trigger.js";
import {Game, Layer} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [...blueprint_camera(game), transform([0, 0, 10], [0, 1, 0, 0])]);

    // Light.
    instantiate(game, [transform([1, 1, 1]), light_directional([1, 1, 1], 1)]);

    // Rotating cube.
    instantiate(game, [
        transform(),
        control_always(null, [0.1276794, 0.1448781, 0.2685358, 0.9437144]),
        move(0, Math.PI),
        children([...blueprint_box(game), transform([0, 4, 0])]),
    ]);

    // Trigger.
    instantiate(game, [
        transform([4, 0, 0]),
        collide(false, Layer.None, Layer.Default),
        trigger(Layer.Default, Action.Alert),
    ]);
}
