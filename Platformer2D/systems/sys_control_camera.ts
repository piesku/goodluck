import {pointer_viewport} from "../../lib/input.js";
import {Vec2} from "../../lib/math.js";
import {clamp} from "../../lib/number.js";
import {vec2_scale, vec2_subtract} from "../../lib/vec2.js";
import {viewport_to_world} from "../components/com_camera2d.js";
import {Game, REAL_UNIT_SIZE} from "../game.js";
import {Has} from "../world.js";

const pointer_position: Vec2 = [0, 0];
let wheel_y_clamped = 0;

export function sys_control_camera(game: Game, delta: number) {
    let camera_entity = game.Cameras[0];
    if (camera_entity === undefined) {
        // This system requires the main camera to exist.
        return;
    }

    let camera = game.World.Camera2D[camera_entity];
    let camera_local = game.World.LocalTransform2D[camera_entity];

    if (game.InputDelta["WheelY"]) {
        let cur_zoom = 4 ** (wheel_y_clamped / -500);
        if (0.85 < cur_zoom && cur_zoom < 1.15) {
            cur_zoom = 1;
        }

        wheel_y_clamped = clamp(-1000, 500, wheel_y_clamped + game.InputDelta["WheelY"]);
        let new_zoom = 4 ** (wheel_y_clamped / -500);
        if (0.85 < new_zoom && new_zoom < 1.15) {
            new_zoom = 1;
        }

        game.UnitSize = REAL_UNIT_SIZE * new_zoom;
        game.ViewportResized = true;

        if (pointer_viewport(game, pointer_position)) {
            // Position under the mouse cursor at cur_zoom.
            viewport_to_world(pointer_position, camera, pointer_position);

            let offset: Vec2 = [0, 0];
            vec2_subtract(offset, pointer_position, camera_local.Translation);
            vec2_scale(offset, offset, 1 - cur_zoom / new_zoom);

            camera_local.Translation[0] += offset[0];
            camera_local.Translation[1] += offset[1];
            game.World.Signature[camera_entity] |= Has.Dirty;
        }
    }

    if (game.InputDistance["Mouse0"] > 5) {
        document.body.classList.add("grabbing");
        camera_local.Translation[0] -= game.InputDelta["MouseX"] / game.UnitSize;
        camera_local.Translation[1] += game.InputDelta["MouseY"] / game.UnitSize;
        game.World.Signature[camera_entity] |= Has.Dirty;
    }

    if (game.InputDelta["Mouse0"] === -1) {
        document.body.classList.remove("grabbing");
    }
}
