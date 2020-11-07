import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mat2_colored_diffuse_gouraud} from "../materials/mat2_colored_diffuse_gouraud.js";
import {mat2_colored_diffuse_phong} from "../materials/mat2_colored_diffuse_phong.js";
import {mat2_colored_specular_gouraud} from "../materials/mat2_colored_specular_gouraud.js";
import {mat2_colored_specular_phong} from "../materials/mat2_colored_specular_phong.js";
import {mesh_icosphere_flat} from "../meshes/icosphere_flat.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./loop.js";
import {mat2_colored_diffuse_flat} from "./materials/mat2_colored_diffuse_flat.js";
import {mat2_colored_specular_flat} from "./materials/mat2_colored_specular_flat.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_move} from "./systems/sys_control_move.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render} from "./systems/sys_render2.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export type Entity = number;

export class Game {
    World = new World();

    ViewportWidth = 0;
    ViewportHeight = 0;
    ViewportResized = false;

    Ui = document.querySelector("main")!;
    Canvas = document.querySelector("canvas")!;
    Gl = this.Canvas.getContext("webgl2")!;

    MaterialColoredDiffuseFlat = mat2_colored_diffuse_flat(this.Gl);
    MaterialColoredDiffuseGouraud = mat2_colored_diffuse_gouraud(this.Gl);
    MaterialColoredDiffusePhong = mat2_colored_diffuse_phong(this.Gl);
    MaterialColoredSpecularFlat = mat2_colored_specular_flat(this.Gl);
    MaterialColoredSpecularGouraud = mat2_colored_specular_gouraud(this.Gl);
    MaterialColoredSpecularPhong = mat2_colored_specular_phong(this.Gl);

    MeshIcosphereFlat = mesh_icosphere_flat(this.Gl);

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Camera> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop() : loop_start(this)
        );

        this.Gl.enable(GL_DEPTH_TEST);
        this.Gl.enable(GL_CULL_FACE);
    }

    FrameReset() {
        this.ViewportResized = false;
    }

    FrameUpdate(delta: number) {
        let now = performance.now();
        sys_control_move(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
