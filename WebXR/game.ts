import {GameXR} from "../common/game.js";
import {Entity} from "../common/world.js";
import {mat_forward_colored_gouraud} from "../materials/mat_forward_colored_gouraud.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_hand} from "../meshes/hand.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_xr} from "./systems/sys_control_xr.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_render_forward} from "./systems/sys_render_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {sys_ui} from "./systems/sys_ui.js";
import {World} from "./world.js";

export class Game extends GameXR {
    World = new World();

    MaterialColoredGouraud = mat_forward_colored_gouraud(this.Gl);
    MeshCube = mesh_cube(this.Gl);
    MeshHand = mesh_hand(this.Gl);

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Entity> = [];

    override FrameUpdate(delta: number) {
        sys_control_xr(this, delta);
        sys_transform(this, delta);
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render_forward(this, delta);
        sys_ui(this, delta);
    }
}
