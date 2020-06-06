import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mat2_diffuse_gouraud} from "../materials/mat2_diffuse_gouraud.js";
import {mat2_diffuse_phong} from "../materials/mat2_diffuse_phong.js";
import {mat2_specular_gouraud} from "../materials/mat2_specular_gouraud.js";
import {mat2_specular_phong} from "../materials/mat2_specular_phong.js";
import {mesh_icosphere_flat} from "../meshes/icosphere_flat.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./core.js";
import {mat2_diffuse_flat} from "./materials/mat2_diffuse_flat.js";
import {mat2_specular_flat} from "./materials/mat2_specular_flat.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_render} from "./systems/sys_render.js";
import {sys_rotate} from "./systems/sys_rotate.js";
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

    MaterialDiffuseFlat = mat2_diffuse_flat(this.Gl);
    MaterialDiffuseGouraud = mat2_diffuse_gouraud(this.Gl);
    MaterialDiffusePhong = mat2_diffuse_phong(this.Gl);
    MaterialSpecularFlat = mat2_specular_flat(this.Gl);
    MaterialSpecularGouraud = mat2_specular_gouraud(this.Gl);
    MaterialSpecularPhong = mat2_specular_phong(this.Gl);

    MeshIcosphereFlat = mesh_icosphere_flat(this.Gl);

    Camera?: Camera;
    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);

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
        sys_rotate(this, delta);
        sys_transform(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
