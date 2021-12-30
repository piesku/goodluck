import {Game3D} from "../common/game.js";
import {Entity} from "../common/world.js";
import {MAX_FORWARD_LIGHTS} from "../materials/light.js";
import {mat_forward_colored_gouraud} from "../materials/mat_forward_colored_gouraud.js";
import {mat_forward_colored_line} from "../materials/mat_forward_colored_unlit.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_terrain} from "../meshes/terrain.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_control_dolly} from "./systems/sys_control_dolly.js";
import {sys_control_keyboard} from "./systems/sys_control_keyboard.js";
import {sys_control_mouse_drag} from "./systems/sys_control_mouse_drag.js";
import {sys_control_player} from "./systems/sys_control_player.js";
import {sys_control_touch_drag} from "./systems/sys_control_touch_drag.js";
import {sys_draw} from "./systems/sys_draw.js";
import {sys_highlight} from "./systems/sys_highlight.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_nav} from "./systems/sys_nav.js";
import {Picked, sys_pick} from "./systems/sys_pick.js";
import {sys_render_forward} from "./systems/sys_render_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_select} from "./systems/sys_select.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export class Game extends Game3D {
    World = new World();

    MaterialColoredLine = mat_forward_colored_line(this.Gl);
    MaterialColoredGouraud = mat_forward_colored_gouraud(this.Gl);

    MeshCube = mesh_cube(this.Gl);
    MeshTerrain = mesh_terrain(this.Gl);

    LightPositions = new Float32Array(4 * MAX_FORWARD_LIGHTS);
    LightDetails = new Float32Array(4 * MAX_FORWARD_LIGHTS);

    CameraDolly = 1;
    Picked?: Picked;
    Selected?: Entity;

    override FrameUpdate(delta: number) {
        // Camera and picking.
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_pick(this, delta);

        // User input.
        sys_control_keyboard(this, delta);
        sys_control_mouse_drag(this, delta);
        sys_control_touch_drag(this, delta);
        sys_control_dolly(this, delta);

        // Player order.
        sys_control_player(this, delta);
        sys_select(this, delta);
        sys_highlight(this, delta);

        // Game logic.
        sys_nav(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        sys_collide(this, delta);

        // Rendering.
        sys_light(this, delta);
        sys_render_forward(this, delta);
        sys_draw(this, delta);
    }
}

export const enum Layer {
    None = 0,
}
