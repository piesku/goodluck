import {GameWebGL1} from "../common/game.js";
import {Entity} from "../common/world.js";
import {mat1_forward_colored_gouraud} from "../materials/mat1_forward_colored_gouraud.js";
import {mat1_forward_colored_wireframe} from "../materials/mat1_forward_colored_unlit.js";
import {mesh_cube} from "../meshes/cube.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_control_always} from "./systems/sys_control_always.js";
import {sys_debug} from "./systems/sys_debug.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render_forward} from "./systems/sys_render1_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {sys_trigger} from "./systems/sys_trigger.js";
import {World} from "./world.js";

export class Game extends GameWebGL1 {
    World = new World();

    MaterialColoredWireframe = mat1_forward_colored_wireframe(this.Gl);
    MaterialColoredGouraud = mat1_forward_colored_gouraud(this.Gl);
    MeshCube = mesh_cube(this.Gl);

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Entity> = [];

    override FrameUpdate(delta: number) {
        sys_control_always(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);

        sys_collide(this, delta);
        sys_trigger(this, delta);

        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render_forward(this, delta);
        sys_debug(this, delta);
    }
}

export const enum Layer {
    None = 0,
    Default = 1 << 0,
}
