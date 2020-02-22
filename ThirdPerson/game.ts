import {Material, Mesh} from "../common/material.js";
import {GL_CULL_FACE, GL_CW, GL_DEPTH_TEST} from "../common/webgl.js";
import {mesh_cube} from "../meshes/cube.js";
import {Camera} from "./components/com_camera.js";
import {Light} from "./components/com_light.js";
import {start, stop} from "./core.js";
import {mat_gouraud} from "./materials/mat_gouraud.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_control_player} from "./systems/sys_control_player.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_mimic} from "./systems/sys_mimic.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_physics} from "./systems/sys_physics.js";
import {sys_render} from "./systems/sys_render.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export type Entity = number;

export class Game {
    public World = new World();

    public ViewportWidth = 0;
    public ViewportHeight = 0;
    public ViewportResized = false;
    public UI = document.querySelector("main")!;
    public Canvas = document.querySelector("canvas")!;
    public GL: WebGL2RenderingContext;
    public InputState: Record<string, number> = {};
    public InputEvent: Record<string, number> = {};

    public MaterialGouraud: Material;
    public MeshCube: Mesh;

    public Cameras: Array<Camera> = [];
    public Lights: Array<Light> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? stop() : start(this)
        );

        window.addEventListener("keydown", evt => {
            this.InputState[evt.code] = 1;
            this.InputEvent[evt.code] = 1;
        });
        window.addEventListener("keyup", evt => {
            this.InputState[evt.code] = 0;
            this.InputEvent[evt.code] = -1;
        });
        this.UI.addEventListener("mousedown", evt => {
            this.InputState[`Mouse${evt.button}`] = 1;
            this.InputEvent[`Mouse${evt.button}`] = 1;
        });
        this.UI.addEventListener("mouseup", evt => {
            this.InputState[`Mouse${evt.button}`] = 0;
            this.InputEvent[`Mouse${evt.button}`] = -1;
        });
        this.UI.addEventListener("mousemove", evt => {
            this.InputState.MouseX = evt.offsetX;
            this.InputState.MouseY = evt.offsetY;
            this.InputEvent.MouseX = evt.movementX;
            this.InputEvent.MouseY = evt.movementY;
        });
        this.UI.addEventListener("wheel", evt => {
            this.InputEvent.WheelY = evt.deltaY;
        });
        this.UI.addEventListener("contextmenu", evt => evt.preventDefault());
        this.UI.addEventListener("click", () => this.UI.requestPointerLock());

        this.GL = this.Canvas.getContext("webgl2")!;
        this.GL.enable(GL_DEPTH_TEST);
        this.GL.enable(GL_CULL_FACE);
        this.GL.frontFace(GL_CW);

        this.MaterialGouraud = mat_gouraud(this.GL);
        this.MeshCube = mesh_cube(this.GL);
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

        // Player input.
        sys_control_player(this, delta);

        // Game logic.
        sys_move(this, delta);
        sys_mimic(this, delta);
        sys_transform(this, delta);

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
