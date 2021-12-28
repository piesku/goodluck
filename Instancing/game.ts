import {Game3D} from "../common/game.js";
import {MAX_FORWARD_LIGHTS} from "../materials/light.js";
import {mesh_cube} from "../meshes/cube.js";
import {mat_forward_instanced_colored_unlit} from "./materials/mat_forward_instanced_colored_unlit.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_render_instanced} from "./systems/sys_render_instanced.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export class Game extends Game3D {
    World = new World();

    MaterialInstancedColoredUnlit = mat_forward_instanced_colored_unlit(this.Gl);
    MeshCube = mesh_cube(this.Gl);

    LightPositions = new Float32Array(4 * MAX_FORWARD_LIGHTS);
    LightDetails = new Float32Array(4 * MAX_FORWARD_LIGHTS);

    override FrameUpdate(delta: number) {
        sys_resize(this, delta);
        sys_camera(this, delta);

        sys_transform(this, delta);

        sys_light(this, delta);
        sys_render_instanced(this, delta);
    }
}
