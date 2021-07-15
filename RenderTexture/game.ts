import {create_forward_target} from "../common/framebuffer.js";
import {Game3D} from "../common/game.js";
import {Entity} from "../common/world.js";
import {mat_forward_textured_unlit} from "../materials/mat_forward_textured_unlit.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_plane} from "../meshes/plane.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_always} from "./systems/sys_control_always.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render_forward} from "./systems/sys_render_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export class Game extends Game3D {
    World = new World();

    MaterialTexturedUnlit = mat_forward_textured_unlit(this.Gl);
    MeshCube = mesh_cube(this.Gl);
    MeshPlane = mesh_plane(this.Gl);

    Textures: Record<string, WebGLTexture> = {};
    Targets = {
        Minimap: create_forward_target(this.Gl, 256, 256),
    };

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
        sys_render_forward(this, delta);
    }
}
