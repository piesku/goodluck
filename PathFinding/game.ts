import {RaycastHit} from "../common/raycast.js";
import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_terrain} from "../meshes/terrain.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./core.js";
import {mat_basic_line} from "./materials/mat_basic_line.js";
import {mat_diffuse_gouraud} from "./materials/mat_diffuse_gouraud.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_draw} from "./systems/sys_draw.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_nav} from "./systems/sys_nav.js";
import {sys_pick} from "./systems/sys_pick.js";
import {sys_render} from "./systems/sys_render.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export type Entity = number;

export class Game {
    World = new World();

    ViewportWidth = 0;
    ViewportHeight = 0;
    ViewportResized = false;

    InputState: Record<string, number> = {
        MouseX: 0,
        MouseY: 0,
    };
    InputDelta: Record<string, number> = {
        MouseX: 0,
        MouseY: 0,
    };

    UI = document.querySelector("main")!;
    CanvasScene = document.querySelector("canvas#scene")! as HTMLCanvasElement;
    GL = this.CanvasScene.getContext("webgl2")!;
    CanvasBillboard = document.querySelector("canvas#billboard")! as HTMLCanvasElement;
    Context2D = this.CanvasBillboard.getContext("2d")!;

    MaterialBasicLine = mat_basic_line(this.GL);
    MaterialDiffuseGouraud = mat_diffuse_gouraud(this.GL);
    MeshCube = mesh_cube(this.GL);
    MeshTerrain = mesh_terrain(this.GL);

    Camera?: Camera;
    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);

    Pick?: RaycastHit;

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop() : loop_start(this)
        );

        this.UI.addEventListener("mousedown", (evt) => {
            this.InputState[`Mouse${evt.button}`] = 1;
            this.InputDelta[`Mouse${evt.button}`] = 1;
        });
        this.UI.addEventListener("mouseup", (evt) => {
            this.InputState[`Mouse${evt.button}`] = 0;
            this.InputDelta[`Mouse${evt.button}`] = -1;
        });
        this.UI.addEventListener("mousemove", (evt) => {
            this.InputState.MouseX = evt.offsetX;
            this.InputState.MouseY = evt.offsetY;
            this.InputDelta.MouseX = evt.movementX;
            this.InputDelta.MouseY = evt.movementY;
        });

        this.GL.enable(GL_DEPTH_TEST);
        this.GL.enable(GL_CULL_FACE);
    }

    FrameReset() {
        this.ViewportResized = false;
        for (let name in this.InputDelta) {
            this.InputDelta[name] = 0;
        }
    }

    FrameUpdate(delta: number) {
        let now = performance.now();
        sys_nav(this, delta);
        sys_transform(this, delta);
        sys_camera(this, delta);
        sys_pick(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_draw(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
