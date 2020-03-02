import {Material, Mesh} from "../common/material.js";
import {GL_CULL_FACE, GL_CW, GL_DEPTH_TEST} from "../common/webgl.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_icosphere_flat} from "../meshes/icosphere_flat.js";
import {mesh_icosphere_smooth} from "../meshes/icosphere_smooth.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./core.js";
import {mat_basic_points} from "./materials/mat_basic_points.js";
import {mat_basic_triangles} from "./materials/mat_basic_triangles.js";
import {mat_basic_wireframe} from "./materials/mat_basic_wireframe.js";
import {mat_diffuse_flat} from "./materials/mat_diffuse_flat.js";
import {mat_diffuse_gouraud} from "./materials/mat_diffuse_gouraud.js";
import {mat_diffuse_phong} from "./materials/mat_diffuse_phong.js";
import {mat_specular_flat} from "./materials/mat_specular_flat.js";
import {mat_specular_gouraud} from "./materials/mat_specular_gouraud.js";
import {mat_specular_phong} from "./materials/mat_specular_phong.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_render} from "./systems/sys_render.js";
import {sys_rotate} from "./systems/sys_rotate.js";
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

    MaterialBasicPoints: Material;
    MaterialBasicWireframe: Material;
    MaterialBasicTriangles: Material;
    MaterialDiffuseFlat: Material;
    MaterialDiffuseGouraud: Material;
    MaterialDiffusePhong: Material;
    MaterialSpecularFlat: Material;
    MaterialSpecularGouraud: Material;
    MaterialSpecularPhong: Material;

    MeshCube: Mesh;
    MeshIcosphereFlat: Mesh;
    MeshIcosphereSmooth: Mesh;

    Camera?: Camera;
    LightPositions: Array<number> = [];
    LightDetails: Array<number> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop() : loop_start(this)
        );

        this.GL = this.Canvas.getContext("webgl2")!;
        this.GL.enable(GL_DEPTH_TEST);
        this.GL.enable(GL_CULL_FACE);
        this.GL.frontFace(GL_CW);

        this.MaterialBasicPoints = mat_basic_points(this.GL);
        this.MaterialBasicWireframe = mat_basic_wireframe(this.GL);
        this.MaterialBasicTriangles = mat_basic_triangles(this.GL);
        this.MaterialDiffuseFlat = mat_diffuse_flat(this.GL);
        this.MaterialDiffuseGouraud = mat_diffuse_gouraud(this.GL);
        this.MaterialDiffusePhong = mat_diffuse_phong(this.GL);
        this.MaterialSpecularFlat = mat_specular_flat(this.GL);
        this.MaterialSpecularGouraud = mat_specular_gouraud(this.GL);
        this.MaterialSpecularPhong = mat_specular_phong(this.GL);

        this.MeshCube = mesh_cube(this.GL);
        this.MeshIcosphereFlat = mesh_icosphere_flat(this.GL);
        this.MeshIcosphereSmooth = mesh_icosphere_smooth(this.GL);
    }

    FrameReset() {
        this.ViewportResized = false;
    }

    FrameUpdate(delta: number) {
        let now = performance.now();
        sys_rotate(this, delta);
        sys_transform(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
