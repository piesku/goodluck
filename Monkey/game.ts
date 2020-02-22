import {Material, Mesh} from "../common/material.js";
import {GL_CULL_FACE, GL_CW, GL_DEPTH_TEST} from "../common/webgl.js";
import {mesh_monkey_flat} from "../meshes/monkey_flat.js";
import {mesh_monkey_smooth} from "../meshes/monkey_smooth.js";
import {Camera} from "./components/com_camera.js";
import {Light} from "./components/com_light.js";
import {start, stop} from "./core.js";
import {mat_flat} from "./materials/mat_flat.js";
import {mat_phong} from "./materials/mat_phong.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
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

    public MaterialFlat: Material;
    public MaterialPhong: Material;
    public MeshMonkeyFlat: Mesh;
    public MeshMonkeySmooth: Mesh;

    public Cameras: Array<Camera> = [];
    public Lights: Array<Light> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? stop() : start(this)
        );

        this.GL = this.Canvas.getContext("webgl2")!;
        this.GL.enable(GL_DEPTH_TEST);
        this.GL.enable(GL_CULL_FACE);
        this.GL.frontFace(GL_CW);

        this.MaterialFlat = mat_flat(this.GL);
        this.MaterialPhong = mat_phong(this.GL);
        this.MeshMonkeyFlat = mesh_monkey_flat(this.GL);
        this.MeshMonkeySmooth = mesh_monkey_smooth(this.GL);
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
