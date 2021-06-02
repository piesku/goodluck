import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mat1_forward_colored_gouraud} from "../materials/mat1_forward_colored_gouraud.js";
import {mesh_cube} from "../meshes/cube.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./impl.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_keyboard} from "./systems/sys_control_keyboard.js";
import {sys_control_mouse} from "./systems/sys_control_mouse.js";
import {sys_control_touch} from "./systems/sys_control_touch.js";
import {sys_control_xbox} from "./systems/sys_control_xbox.js";
import {sys_draw} from "./systems/sys_draw.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render_forward} from "./systems/sys_render1_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {sys_ui} from "./systems/sys_ui.js";
import {World} from "./world.js";

export type Entity = number;

export class Game {
    World = new World();

    ViewportWidth = window.innerWidth;
    ViewportHeight = window.innerHeight;
    ViewportResized = true;

    InputState: Record<string, number> = {};
    InputDelta: Record<string, number> = {};

    Ui = document.querySelector("main")!;
    Canvas = document.querySelector("#scene")! as HTMLCanvasElement;
    Gl = this.Canvas.getContext("webgl")!;
    ExtVao = this.Gl.getExtension("OES_vertex_array_object")!;

    Billboard = document.querySelector("#billboard")! as HTMLCanvasElement;
    Context2D = this.Billboard.getContext("2d")!;

    MaterialColoredGouraud = mat1_forward_colored_gouraud(this.Gl);
    MeshCube = mesh_cube(this.Gl);

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Camera> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop() : loop_start(this)
        );

        window.addEventListener("keydown", (evt) => {
            if (!evt.repeat) {
                this.InputState[evt.code] = 1;
                this.InputDelta[evt.code] = 1;
            }
        });
        window.addEventListener("keyup", (evt) => {
            this.InputState[evt.code] = 0;
            this.InputDelta[evt.code] = -1;
        });
        this.Ui.addEventListener("mousedown", (evt) => {
            this.InputState[`Mouse${evt.button}`] = 1;
            this.InputDelta[`Mouse${evt.button}`] = 1;
        });
        this.Ui.addEventListener("mouseup", (evt) => {
            this.InputState[`Mouse${evt.button}`] = 0;
            this.InputDelta[`Mouse${evt.button}`] = -1;
        });
        this.Ui.addEventListener("mousemove", (evt) => {
            this.InputState.MouseX = evt.offsetX;
            this.InputState.MouseY = evt.offsetY;
            this.InputDelta.MouseX = evt.movementX;
            this.InputDelta.MouseY = evt.movementY;
        });
        this.Ui.addEventListener("touchstart", (evt) => {
            for (let i = 0; i < evt.changedTouches.length; i++) {
                let touch = evt.changedTouches[i];
                this.InputState[`Touch${touch.identifier}`] = 1;
                this.InputState[`Touch${touch.identifier}X`] = touch.screenX;
                this.InputState[`Touch${touch.identifier}Y`] = touch.screenY;
                this.InputDelta[`Touch${touch.identifier}`] = 1;
                this.InputDelta[`Touch${touch.identifier}X`] = 0;
                this.InputDelta[`Touch${touch.identifier}Y`] = 0;
            }
        });
        this.Ui.addEventListener("touchmove", (evt) => {
            for (let i = 0; i < evt.changedTouches.length; i++) {
                let touch = evt.changedTouches[i];
                this.InputDelta[`Touch${touch.identifier}X`] =
                    touch.screenX - this.InputState[`Touch${touch.identifier}X`];
                this.InputDelta[`Touch${touch.identifier}Y`] =
                    touch.screenY - this.InputState[`Touch${touch.identifier}Y`];
                this.InputState[`Touch${touch.identifier}X`] = touch.screenX;
                this.InputState[`Touch${touch.identifier}Y`] = touch.screenY;
            }
        });
        this.Ui.addEventListener("touchend", (evt) => {
            for (let i = 0; i < evt.changedTouches.length; i++) {
                let touch = evt.changedTouches[i];
                this.InputState[`Touch${touch.identifier}`] = 0;
                this.InputDelta[`Touch${touch.identifier}`] = -1;
            }
        });
        this.Ui.addEventListener("touchcancel", (evt) => {
            for (let i = 0; i < evt.changedTouches.length; i++) {
                let touch = evt.changedTouches[i];
                this.InputState[`Touch${touch.identifier}`] = 0;
                this.InputDelta[`Touch${touch.identifier}`] = -1;
            }
        });
        this.Ui.addEventListener("wheel", (evt) => {
            this.InputDelta.WheelY = evt.deltaY;
        });
        this.Ui.addEventListener("contextmenu", (evt) => evt.preventDefault());
        this.Ui.addEventListener("click", () => this.Ui.requestPointerLock());

        this.Gl.enable(GL_DEPTH_TEST);
        this.Gl.enable(GL_CULL_FACE);
    }

    FrameReset() {
        this.ViewportResized = false;
        for (let name in this.InputDelta) {
            this.InputDelta[name] = 0;
        }
    }

    FrameUpdate(delta: number) {
        let now = performance.now();
        sys_control_keyboard(this, delta);
        sys_control_mouse(this, delta);
        sys_control_xbox(this, delta);
        sys_control_touch(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render_forward(this, delta);
        sys_draw(this, delta);
        sys_ui(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
