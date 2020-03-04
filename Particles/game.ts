import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./core.js";
import {mat_particles} from "./materials/mat_particles.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_particles} from "./systems/sys_particles.js";
import {sys_render} from "./systems/sys_render.js";
import {sys_shake} from "./systems/sys_shake.js";
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

    MaterialParticles = mat_particles(this.GL);

    Camera?: Camera;

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
        sys_particles(this, delta);
        sys_shake(this, delta);
        sys_transform(this, delta);
        sys_camera(this, delta);
        sys_render(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
