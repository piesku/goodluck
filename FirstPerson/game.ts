import {Game3D} from "../common/game.js";
import {MAX_FORWARD_LIGHTS} from "../materials/light.js";
import {mat_forward_colored_gouraud} from "../materials/mat_forward_colored_gouraud.js";
import {mesh_cube} from "../meshes/cube.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_keyboard} from "./systems/sys_control_keyboard.js";
import {sys_control_mouse_move} from "./systems/sys_control_mouse_move.js";
import {sys_control_touch_move} from "./systems/sys_control_touch_move.js";
import {sys_control_xbox} from "./systems/sys_control_xbox.js";
import {sys_draw} from "./systems/sys_draw.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render_forward} from "./systems/sys_render_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {sys_ui} from "./systems/sys_ui.js";
import {World} from "./world.js";

export class Game extends Game3D {
    World = new World();

    MaterialColoredGouraud = mat_forward_colored_gouraud(this.Gl);
    MeshCube = mesh_cube(this.Gl);

    LightPositions = new Float32Array(4 * MAX_FORWARD_LIGHTS);
    LightDetails = new Float32Array(4 * MAX_FORWARD_LIGHTS);

    override FrameUpdate(delta: number) {
        sys_resize(this, delta);
        sys_camera(this, delta);

        sys_control_keyboard(this, delta);
        sys_control_mouse_move(this, delta);
        sys_control_touch_move(this, delta);
        sys_control_xbox(this, delta);

        sys_move(this, delta);
        sys_transform(this, delta);

        sys_light(this, delta);
        sys_render_forward(this, delta);
        sys_draw(this, delta);
        sys_ui(this, delta);
    }
}
