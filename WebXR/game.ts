import {Material, Mesh} from "../common/material.js";
import {GL_CULL_FACE, GL_CW, GL_DEPTH_TEST} from "../common/webgl.js";
import {mesh_cube} from "../meshes/cube.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop, xr_init} from "./core.js";
import {mat_gouraud} from "./materials/mat_gouraud.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_render} from "./systems/sys_render.js";
import {sys_transform} from "./systems/sys_transform.js";
import {sys_ui} from "./systems/sys_ui.js";
import {World} from "./world.js";

export type Entity = number;

export class Game {
    World = new World();

    ViewportWidth = 0;
    ViewportHeight = 0;
    ViewportResized = false;
    UI = document.querySelector("main")!;
    Canvas = document.querySelector("canvas")!;
    GL: WebGL2RenderingContext;

    XrSupported = false;
    XrSession?: XRSession;
    XrFrame?: XRFrame;
    XrSpace?: XRReferenceSpace;

    MaterialGouraud: Material;
    MeshCube: Mesh;

    Camera?: Camera;
    LightPositions: Array<number> = [];
    LightDetails: Array<number> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop(this) : loop_start(this)
        );

        this.GL = this.Canvas.getContext("webgl2", {xrCompatible: true})! as WebGL2RenderingContext;
        this.GL.enable(GL_DEPTH_TEST);
        this.GL.enable(GL_CULL_FACE);
        this.GL.frontFace(GL_CW);

        this.MaterialGouraud = mat_gouraud(this.GL);
        this.MeshCube = mesh_cube(this.GL);

        if (navigator.xr) {
            xr_init(this);
        }
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
        sys_ui(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
