import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {loop_start, loop_stop} from "./impl.js";
import {mat1_forward_particles_colored} from "./materials/mat1_forward_particles_colored.js";
import {mat1_forward_particles_textured} from "./materials/mat1_forward_particles_textured.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_particles} from "./systems/sys_particles.js";
import {sys_render_forward} from "./systems/sys_render_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_shake} from "./systems/sys_shake.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export type Entity = number;

export class Game {
    World = new World();

    ViewportWidth = window.innerWidth;
    ViewportHeight = window.innerHeight;
    ViewportResized = true;

    Ui = document.querySelector("main")!;
    Billboard = document.querySelector("#billboard")! as HTMLCanvasElement;
    Canvas = document.querySelector("#scene")! as HTMLCanvasElement;
    Gl = this.Canvas.getContext("webgl")!;

    MaterialParticlesColored = mat1_forward_particles_colored(this.Gl);
    MaterialParticlesTextured = mat1_forward_particles_textured(this.Gl);
    Textures: Record<string, WebGLTexture> = {};

    Cameras: Array<Entity> = [];

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
        sys_particles(this, delta);
        sys_shake(this, delta);
        sys_transform(this, delta);
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_render_forward(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
