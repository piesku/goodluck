import {Material, Mesh} from "../common/material.js";
import {GL_CULL_FACE, GL_CW, GL_DEPTH_TEST} from "../common/webgl.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_icosphere_flat} from "../meshes/icosphere_flat.js";
import {mesh_icosphere_smooth} from "../meshes/icosphere_smooth.js";
import {Camera} from "./components/com_camera.js";
import {Light} from "./components/com_light.js";
import {start, stop} from "./core.js";
import {mat_basic} from "./materials/mat_basic.js";
import {mat_flat} from "./materials/mat_flat.js";
import {mat_gouraud} from "./materials/mat_gouraud.js";
import {mat_phong} from "./materials/mat_phong.js";
import {mat_points} from "./materials/mat_points.js";
import {mat_wireframe} from "./materials/mat_wireframe.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_render} from "./systems/sys_render.js";
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
    GL: WebGL2RenderingContext;

    MaterialPoints: Material;
    MaterialWireframe: Material;
    MaterialBasic: Material;
    MaterialFlat: Material;
    MaterialGouraud: Material;
    MaterialPhong: Material;

    MeshCube: Mesh;
    MeshIcosphereFlat: Mesh;
    MeshIcosphereSmooth: Mesh;

    Cameras: Array<Camera> = [];
    Lights: Array<Light> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? stop() : start(this)
        );

        this.GL = this.Canvas.getContext("webgl2")!;
        this.GL.enable(GL_DEPTH_TEST);
        this.GL.enable(GL_CULL_FACE);
        this.GL.frontFace(GL_CW);

        this.MaterialPoints = mat_points(this.GL);
        this.MaterialWireframe = mat_wireframe(this.GL);
        this.MaterialBasic = mat_basic(this.GL);
        this.MaterialFlat = mat_flat(this.GL);
        this.MaterialGouraud = mat_gouraud(this.GL);
        this.MaterialPhong = mat_phong(this.GL);

        this.MeshCube = mesh_cube(this.GL);
        this.MeshIcosphereFlat = mesh_icosphere_flat(this.GL);
        this.MeshIcosphereSmooth = mesh_icosphere_smooth(this.GL);
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
