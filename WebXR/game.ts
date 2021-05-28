import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mat2_colored_gouraud} from "../materials/mat2_colored_gouraud.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_hand} from "../meshes/hand.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./impl_ext.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_oculus} from "./systems/sys_control_oculus.js";
import {sys_control_pose} from "./systems/sys_control_pose.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_render_forward} from "./systems/sys_render_forward.js";
import {sys_transform} from "./systems/sys_transform.js";
import {sys_ui} from "./systems/sys_ui.js";
import {World} from "./world.js";
import {xr_init} from "./xr.js";

export type Entity = number;

export class Game {
    World = new World();

    ViewportWidth = 0;
    ViewportHeight = 0;
    ViewportResized = false;

    Ui = document.querySelector("main")!;
    Canvas = document.querySelector("canvas")!;
    Gl = this.Canvas.getContext("webgl2", {xrCompatible: true})! as WebGL2RenderingContext;

    XrSupported = false;
    XrSession?: XRSession;
    XrSpace?: XRReferenceSpace;
    // XrFrame can be used to check whether we're presenting to a VR display.
    XrFrame?: XRFrame;
    XrInputs: Record<string, XRInputSource> = {};

    MaterialColoredGouraud = mat2_colored_gouraud(this.Gl);
    MeshCube = mesh_cube(this.Gl);
    MeshHand = mesh_hand(this.Gl);

    Camera?: Camera;
    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop(this) : loop_start(this)
        );

        this.Gl.enable(GL_DEPTH_TEST);
        this.Gl.enable(GL_CULL_FACE);

        if (navigator.xr) {
            xr_init(this);
        }
    }

    FrameReset() {
        this.ViewportResized = false;
    }

    FrameUpdate(delta: number) {
        let now = performance.now();
        sys_control_oculus(this, delta);
        sys_control_pose(this, delta);
        sys_transform(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render_forward(this, delta);
        sys_ui(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
