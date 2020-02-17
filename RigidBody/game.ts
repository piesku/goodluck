import {Material, Shape} from "../common/material.js";
import {GL_CULL_FACE, GL_CW, GL_DEPTH_TEST} from "../common/webgl.js";
import {mesh_cube} from "../meshes/cube.js";
import {Camera} from "./components/com_camera.js";
import {Light} from "./components/com_light.js";
import {start, stop} from "./core.js";
import {mat_gouraud} from "./materials/mat_gouraud.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_control_spawner} from "./systems/sys_control_spawner.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_lifespan} from "./systems/sys_lifespan.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_physics} from "./systems/sys_physics.js";
import {sys_render} from "./systems/sys_render.js";
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

    public ViewportWidth = window.innerWidth;
    public ViewportHeight = window.innerHeight;
    public UI = document.querySelector("main")!;
    public GL: WebGL2RenderingContext;
    public InputState: InputState = {mouse_x: 0, mouse_y: 0};
    public InputEvent: InputEvent = {mouse_x: 0, mouse_y: 0, wheel_y: 0};

    public MaterialGouraud: Material;
    public MeshCube: Shape;

    public Cameras: Array<Camera> = [];
    public Lights: Array<Light> = [];

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

        let canvas3d = document.querySelector("canvas")!;
        canvas3d.width = this.ViewportWidth;
        canvas3d.height = this.ViewportHeight;
        this.GL = canvas3d.getContext("webgl2")!;
        this.GL.enable(GL_DEPTH_TEST);
        this.GL.enable(GL_CULL_FACE);
        this.GL.frontFace(GL_CW);

        this.MaterialGouraud = mat_gouraud(this.GL);
        this.MeshCube = mesh_cube(this.GL);
    }

    Update(delta: number) {
        let now = performance.now();
        // Destroy entities past their age.
        sys_lifespan(this, delta);

        // Input and AI.
        sys_control_spawner(this, delta);

        // Collisions and physics.
        sys_collide(this, delta);
        sys_physics(this, delta);
        sys_transform(this, delta);

        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
