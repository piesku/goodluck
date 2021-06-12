import {GameWebGL1} from "../common/game.js";
import {Mesh} from "../common/mesh.js";
import {mat1_forward_colored_gouraud} from "../materials/mat1_forward_colored_gouraud.js";
import {mat1_forward_colored_phong} from "../materials/mat1_forward_colored_phong.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_render_forward} from "./systems/sys_render1_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export type Entity = number;

export class Game extends GameWebGL1 {
    World = new World();

    MaterialColoredGouraud = mat1_forward_colored_gouraud(this.Gl);
    MaterialColoredPhong = mat1_forward_colored_phong(this.Gl);

    Meshes: Record<string, Mesh> = {};

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Entity> = [];

    override FrameUpdate(delta: number) {
        sys_transform(this, delta);
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render_forward(this, delta);
    }
}
