import {Material} from "../common/material.js";
import {GL_CULL_FACE, GL_CW, GL_DEPTH_TEST} from "../common/webgl.js";
import {Camera} from "./components/com_camera.js";
import {start, stop} from "./core.js";
import {mat_particles} from "./materials/mat_particles.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_particles} from "./systems/sys_particles.js";
import {sys_render} from "./systems/sys_render.js";
import {sys_shake} from "./systems/sys_shake.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export type Entity = number;

export interface InputState {
    [k: string]: number;
    mouse_x: number;
    mouse_y: number;
}

export interface InputEvent {
    [k: string]: number;
    mouse_x: number;
    mouse_y: number;
    wheel_y: number;
}

export class Game {
    public World = new World();

    public ViewportWidth = 0;
    public ViewportHeight = 0;
    public ViewportResized = false;
    public UI = document.querySelector("main")!;
    public Canvas3D = document.querySelector("canvas")!;
    public GL: WebGL2RenderingContext;
    public InputState: InputState = {mouse_x: 0, mouse_y: 0};
    public InputEvent: InputEvent = {mouse_x: 0, mouse_y: 0, wheel_y: 0};

    public MaterialParticles: Material;

    public Cameras: Array<Camera> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? stop() : start(this)
        );

        window.addEventListener("keydown", evt => (this.InputState[evt.code] = 1));
        window.addEventListener("keyup", evt => (this.InputState[evt.code] = 0));
        this.UI.addEventListener("contextmenu", evt => evt.preventDefault());
        this.UI.addEventListener("mousedown", evt => {
            this.InputState[`mouse_${evt.button}`] = 1;
            this.InputEvent[`mouse_${evt.button}_down`] = 1;
        });
        this.UI.addEventListener("mouseup", evt => {
            this.InputState[`mouse_${evt.button}`] = 0;
            this.InputEvent[`mouse_${evt.button}_up`] = 1;
        });
        this.UI.addEventListener("mousemove", evt => {
            this.InputState.mouse_x = evt.offsetX;
            this.InputState.mouse_y = evt.offsetY;
            this.InputEvent.mouse_x = evt.movementX;
            this.InputEvent.mouse_y = evt.movementY;
        });
        this.UI.addEventListener("wheel", evt => {
            this.InputEvent.wheel_y = evt.deltaY;
        });
        this.UI.addEventListener("click", () => this.UI.requestPointerLock());

        this.GL = this.Canvas3D.getContext("webgl2")!;
        this.GL.enable(GL_DEPTH_TEST);
        this.GL.enable(GL_CULL_FACE);
        this.GL.frontFace(GL_CW);

        this.MaterialParticles = mat_particles(this.GL);
    }

    FrameReset() {
        // Reset event flags for the next frame.
        this.ViewportResized = false;
        for (let name in this.InputEvent) {
            this.InputEvent[name] = 0;
        }
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
