import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mat1_colored_gouraud} from "../materials/mat1_colored_gouraud.js";
import {mat1_colored_phong} from "../materials/mat1_colored_phong.js";
import {mat1_colored_points} from "../materials/mat1_colored_points.js";
import {mat1_colored_unlit, mat1_colored_wireframe} from "../materials/mat1_colored_unlit.js";
import {mat1_mapped} from "../materials/mat1_mapped.js";
import {mat1_textured_gouraud} from "../materials/mat1_textured_gouraud.js";
import {mat1_textured_phong} from "../materials/mat1_textured_phong.js";
import {mat1_textured_unlit} from "../materials/mat1_textured_unlit.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_icosphere_smooth} from "../meshes/icosphere_smooth.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./impl.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_always} from "./systems/sys_control_always.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render} from "./systems/sys_render1.js";
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

    MaterialColoredPoints = mat1_colored_points(this.Gl);
    MaterialColoredWireframe = mat1_colored_wireframe(this.Gl);
    MaterialColoredUnlit = mat1_colored_unlit(this.Gl);
    MaterialColoredGouraud = mat1_colored_gouraud(this.Gl);
    MaterialColoredPhong = mat1_colored_phong(this.Gl);
    MaterialTexturedUnlit = mat1_textured_unlit(this.Gl);
    MaterialTexturedGouraud = mat1_textured_gouraud(this.Gl);
    MaterialTexturedPhong = mat1_textured_phong(this.Gl);
    MaterialMapped = mat1_mapped(this.Gl);

    MeshCube = mesh_cube(this.Gl);
    MeshIcosphereSmooth = mesh_icosphere_smooth(this.Gl);

    Textures: Record<string, WebGLTexture> = {};

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Camera> = [];

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
        sys_control_always(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
