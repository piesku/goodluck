import {create_depth_target} from "../common/framebuffer.js";
import {Game3D} from "../common/game.js";
import {Entity} from "../common/world.js";
import {mat_forward_colored_shadows} from "../materials/mat_forward_colored_shadows.js";
import {mat_forward_depth} from "../materials/mat_forward_depth.js";
import {mesh_cube} from "../meshes/cube.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_always} from "./systems/sys_control_always.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render_depth} from "./systems/sys_render_depth.js";
import {sys_render_forward} from "./systems/sys_render_ext.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export class Game extends Game3D {
    World = new World();

    MaterialColoredShadows = mat_forward_colored_shadows(this.Gl);
    MaterialDepth = mat_forward_depth(this.Gl);

    MeshCube = mesh_cube(this.Gl);

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Entity> = [];

    Targets = {
        Sun: create_depth_target(this.Gl, 2048, 2048),
    };

    override FrameUpdate(delta: number) {
        sys_control_always(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render_depth(this, delta);
        sys_render_forward(this, delta);
    }
}
