import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mat1_colored_diffuse_gouraud} from "../materials/mat1_colored_diffuse_gouraud.js";
import {mat1_colored_unlit_wireframe} from "../materials/mat1_colored_unlit_wireframe.js";
import {mesh_cube} from "../meshes/cube.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./loop.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_control_move} from "./systems/sys_control_move.js";
import {sys_debug} from "./systems/sys_debug.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render} from "./systems/sys_render1.js";
import {sys_transform} from "./systems/sys_transform.js";
import {sys_trigger} from "./systems/sys_trigger.js";
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

    MaterialColoredUnlitWireframe = mat1_colored_unlit_wireframe(this.Gl);
    MaterialColoredDiffuseGouraud = mat1_colored_diffuse_gouraud(this.Gl);
    MeshCube = mesh_cube(this.Gl);

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

        sys_control_move(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);

        sys_collide(this, delta);
        sys_trigger(this, delta);

        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_debug(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}

export const enum Layer {
    None = 0,
    Default = 1 << 0,
}
