import {GameWebGL2} from "../common/game.js";
import {Entity} from "../common/world.js";
import {mat2_forward_colored_gouraud} from "../materials/mat2_forward_colored_gouraud.js";
import {mesh_icosphere_flat} from "../meshes/icosphere_flat.js";
import {mat2_forward_colored_flat} from "./materials/mat2_forward_colored_flat.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_always} from "./systems/sys_control_always.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render_forward} from "./systems/sys_render2_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export class Game extends GameWebGL2 {
    World = new World();

    MaterialColoredFlat = mat2_forward_colored_flat(this.Gl);
    MaterialColoredGouraud = mat2_forward_colored_gouraud(this.Gl);

    MeshIcosphereFlat = mesh_icosphere_flat(this.Gl);

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Entity> = [];

    override FrameUpdate(delta: number) {
        sys_control_always(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render_forward(this, delta);
    }
}
