import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mesh_monkey_flat} from "../meshes/monkey_flat.js";
import {mesh_monkey_smooth} from "../meshes/monkey_smooth.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./core.js";
import {mat_diffuse_flat} from "./materials/mat_diffuse_flat.js";
import {mat_specular_phong} from "./materials/mat_specular_phong.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_render} from "./systems/sys_render.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export type Entity = number;

export class Game {
    World = new World();

    ViewportWidth = 0;
    ViewportHeight = 0;
    ViewportResized = false;

    UI = document.querySelector("main")!;
    Canvas = document.querySelector("canvas")!;
    GL = this.Canvas.getContext("webgl2")!;

    MaterialDiffuseFlat = mat_diffuse_flat(this.GL);
    MaterialSpecularPhong = mat_specular_phong(this.GL);
    MeshMonkeyFlat = mesh_monkey_flat(this.GL);
    MeshMonkeySmooth = mesh_monkey_smooth(this.GL);

    Camera?: Camera;
    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop() : loop_start(this)
        );

        this.GL.enable(GL_DEPTH_TEST);
        this.GL.enable(GL_CULL_FACE);
    }

    FrameReset() {
        this.ViewportResized = false;
    }

    FrameUpdate(delta: number) {
        let now = performance.now();
        sys_transform(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
