import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mat1_textured_diffuse} from "../materials/mat1_textured_diffuse.js";
import {mat1_textured_unlit} from "../materials/mat1_textured_unlit.js";
import {mesh_kulka} from "../meshes/kulka.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./loop.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_move} from "./systems/sys_control_move.js";
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

    MaterialTexturedUnlit = mat1_textured_unlit(this.Gl);
    MaterialTexturedDiffuse = mat1_textured_diffuse(this.Gl);
    MeshKulka = mesh_kulka(this.Gl);

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
        // Reset event flags for the next frame.
        this.ViewportResized = false;
    }

    FrameUpdate(delta: number) {
        let now = performance.now();
        sys_control_move(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
