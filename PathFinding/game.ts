import {GameWebGL1} from "../common/game.js";
import {Mesh} from "../common/mesh.js";
import {Entity} from "../common/world.js";
import {mat1_forward_colored_gouraud} from "../materials/mat1_forward_colored_gouraud.js";
import {mat1_forward_colored_line} from "../materials/mat1_forward_colored_unlit.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_control_camera} from "./systems/sys_control_camera.js";
import {sys_control_keyboard} from "./systems/sys_control_keyboard.js";
import {sys_control_mouse} from "./systems/sys_control_mouse.js";
import {sys_control_player} from "./systems/sys_control_player.js";
import {sys_control_touch} from "./systems/sys_control_touch.js";
import {sys_draw} from "./systems/sys_draw.js";
import {sys_highlight} from "./systems/sys_highlight.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_nav} from "./systems/sys_nav.js";
import {Picked, sys_pick} from "./systems/sys_pick.js";
import {sys_render_forward} from "./systems/sys_render1_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_select} from "./systems/sys_select.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export class Game extends GameWebGL1 {
    World = new World();

    MaterialColoredLine = mat1_forward_colored_line(this.Gl);
    MaterialColoredGouraud = mat1_forward_colored_gouraud(this.Gl);

    Meshes: Record<string, Mesh> = {};

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Entity> = [];

    CameraZoom = 1;
    Picked?: Picked;
    Selected?: Entity;

    override FrameUpdate(delta: number) {
        // Camera picking.
        sys_control_camera(this, delta);
        sys_control_keyboard(this, delta);
        sys_control_mouse(this, delta);
        sys_control_touch(this, delta);
        sys_pick(this, delta);

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
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render_forward(this, delta);
        sys_draw(this, delta);
    }
}

export const enum Layer {
    None = 0,
}
