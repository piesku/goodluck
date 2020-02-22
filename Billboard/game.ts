import {Material, Mesh} from "../common/material.js";
import {GL_CULL_FACE, GL_CW, GL_DEPTH_TEST} from "../common/webgl.js";
import {mesh_cube} from "../meshes/cube.js";
import {Camera} from "./components/com_camera.js";
import {Light} from "./components/com_light.js";
import {start, stop} from "./core.js";
import {mat_gouraud} from "./materials/mat_gouraud.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_player} from "./systems/sys_control_player.js";
import {sys_draw} from "./systems/sys_draw.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
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
    public CanvasScene = document.querySelector("canvas#scene")! as HTMLCanvasElement;
    public CanvasBillboard = document.querySelector("canvas#billboard")! as HTMLCanvasElement;
    public GL: WebGL2RenderingContext;
    public Context2D: CanvasRenderingContext2D;
    public InputState: Record<string, number> = {};
    public InputDelta: Record<string, number> = {};

    public MaterialGouraud: Material;
    public MeshCube: Mesh;

    public Cameras: Array<Camera> = [];
    public Lights: Array<Light> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? stop() : start(this)
        );

        window.addEventListener("keydown", evt => {
            if (!evt.repeat) {
                this.InputState[evt.code] = 1;
                this.InputDelta[evt.code] = 1;
            }
        });
        window.addEventListener("keyup", evt => {
            this.InputState[evt.code] = 0;
            this.InputDelta[evt.code] = -1;
        });
        this.UI.addEventListener("mousedown", evt => {
            this.InputState[`Mouse${evt.button}`] = 1;
            this.InputDelta[`Mouse${evt.button}`] = 1;
        });
        this.UI.addEventListener("mouseup", evt => {
            this.InputState[`Mouse${evt.button}`] = 0;
            this.InputDelta[`Mouse${evt.button}`] = -1;
        });
        this.UI.addEventListener("mousemove", evt => {
            this.InputState.MouseX = evt.offsetX;
            this.InputState.MouseY = evt.offsetY;
            this.InputDelta.MouseX = evt.movementX;
            this.InputDelta.MouseY = evt.movementY;
        });
        this.UI.addEventListener("wheel", evt => {
            this.InputDelta.WheelY = evt.deltaY;
        });
        this.UI.addEventListener("contextmenu", evt => evt.preventDefault());
        this.UI.addEventListener("click", () => this.UI.requestPointerLock());

        this.GL = this.CanvasScene.getContext("webgl2")!;
        this.GL.enable(GL_DEPTH_TEST);
        this.GL.enable(GL_CULL_FACE);
        this.GL.frontFace(GL_CW);

        this.Context2D = this.CanvasBillboard.getContext("2d")!;

        this.MaterialGouraud = mat_gouraud(this.GL);
        this.MeshCube = mesh_cube(this.GL);
    }

    FrameReset() {
        this.ViewportResized = false;
        for (let name in this.InputDelta) {
            this.InputDelta[name] = 0;
        }
    }

    FrameUpdate(delta: number) {
        let now = performance.now();
        sys_control_player(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_draw(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
