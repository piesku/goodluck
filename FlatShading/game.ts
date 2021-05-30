import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mat2_colored_gouraud} from "../materials/mat2_colored_gouraud.js";
import {mesh_icosphere_flat} from "../meshes/icosphere_flat.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./impl.js";
import {mat2_colored_flat} from "./materials/mat2_colored_flat.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_always} from "./systems/sys_control_always.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render_forward} from "./systems/sys_render2_forward.js";
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
    Gl = this.Canvas.getContext("webgl2")!;

    MaterialColoredFlat = mat2_colored_flat(this.Gl);
    MaterialColoredGouraud = mat2_colored_gouraud(this.Gl);

    MeshIcosphereFlat = mesh_icosphere_flat(this.Gl);

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
        sys_render_forward(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
