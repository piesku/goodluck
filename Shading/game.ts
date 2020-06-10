import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mat1_basic_points} from "../materials/mat1_basic_points.js";
import {mat1_basic_triangles} from "../materials/mat1_basic_triangles.js";
import {mat1_basic_wireframe} from "../materials/mat1_basic_wireframe.js";
import {mat1_diffuse_gouraud} from "../materials/mat1_diffuse_gouraud.js";
import {mat1_diffuse_phong} from "../materials/mat1_diffuse_phong.js";
import {mat1_specular_gouraud} from "../materials/mat1_specular_gouraud.js";
import {mat1_specular_phong} from "../materials/mat1_specular_phong.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_icosphere_flat} from "../meshes/icosphere_flat.js";
import {mesh_icosphere_smooth} from "../meshes/icosphere_smooth.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./core.js";
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

    Ui = document.querySelector("main")!;
    Canvas = document.querySelector("canvas")!;
    Gl = this.Canvas.getContext("webgl")!;
    ExtVao = this.Gl.getExtension("OES_vertex_array_object")!;

    MaterialBasicPoints = mat1_basic_points(this.Gl);
    MaterialBasicWireframe = mat1_basic_wireframe(this.Gl);
    MaterialBasicTriangles = mat1_basic_triangles(this.Gl);
    MaterialDiffuseGouraud = mat1_diffuse_gouraud(this.Gl);
    MaterialDiffusePhong = mat1_diffuse_phong(this.Gl);
    MaterialSpecularGouraud = mat1_specular_gouraud(this.Gl);
    MaterialSpecularPhong = mat1_specular_phong(this.Gl);

    MeshCube = mesh_cube(this.Gl);
    MeshIcosphereFlat = mesh_icosphere_flat(this.Gl);
    MeshIcosphereSmooth = mesh_icosphere_smooth(this.Gl);

    Camera?: Camera;
    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop() : loop_start(this)
        );

        this.Gl.enable(GL_DEPTH_TEST);
        this.Gl.enable(GL_CULL_FACE);
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
