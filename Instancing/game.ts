import {Game3D} from "../common/game.js";
import {Vec4} from "../common/math.js";
import {MAX_FORWARD_LIGHTS} from "../materials/light.js";
import {mesh_cube} from "../meshes/cube.js";
import {mat_forward_instanced} from "./materials/mat_forward_instanced.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_render_instanced} from "./systems/sys_render_instanced.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export class Game extends Game3D {
    World = new World();

    MaterialInstanced = mat_forward_instanced(this.Gl);
    MeshCube = mesh_cube(this.Gl);

    LightPositions = new Float32Array(4 * MAX_FORWARD_LIGHTS);
    LightDetails = new Float32Array(4 * MAX_FORWARD_LIGHTS);

    FogColor: Vec4 = [0.9, 0.9, 0.9, 1];
    FogDistance = 150;

    override FrameUpdate(delta: number) {
        sys_resize(this, delta);
        sys_camera(this, delta);

        sys_transform(this, delta);

        sys_light(this, delta);
        sys_render_instanced(this, delta);
    }
}
