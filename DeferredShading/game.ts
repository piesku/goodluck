import {create_render_target, RenderTarget} from "../common/framebuffer.js";
import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mesh_icosphere_flat} from "../meshes/icosphere_flat.js";
import {mesh_icosphere_smooth} from "../meshes/icosphere_smooth.js";
import {mesh_quad} from "../meshes/quad.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./loop.js";
import {mat2_deferred_colored} from "./materials/mat2_deferred_colored.js";
import {mat2_deferred_post_shading} from "./materials/mat2_deferred_post_shading.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_move} from "./systems/sys_control_move.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render_deferred} from "./systems/sys_render_deferred.js";
import {sys_render_postprocess} from "./systems/sys_render_postprocess.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export type Entity = number;

export class Game {
    World = new World();

    ViewportWidth = window.innerWidth;
    ViewportHeight = window.innerHeight;
    ViewportResized = true;

    Canvas = document.querySelector("canvas")!;
    Gl = this.Canvas.getContext("webgl2")!;

    MaterialColored = mat2_deferred_colored(this.Gl);
    MaterialPostprocessOutline = mat2_deferred_post_shading(this.Gl);
    MeshSphereSmooth = mesh_icosphere_smooth(this.Gl);
    MeshSphereFlat = mesh_icosphere_flat(this.Gl);
    MeshQuad = mesh_quad(this.Gl);

    Targets: {
        Gbuffer: RenderTarget;
    };
    Textures: Record<string, WebGLTexture> = {};

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Camera> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop() : loop_start(this)
        );

        // Required for floating point g-buffer textures.
        this.Gl.getExtension("EXT_color_buffer_float");
        this.Targets = {
            // Create the main framebuffer for deferred rendering.
            Gbuffer: create_render_target(this.Gl, this.ViewportWidth, this.ViewportHeight),
        };

        this.Gl.enable(GL_DEPTH_TEST);
        this.Gl.enable(GL_CULL_FACE);

        this.Canvas.width = this.ViewportWidth;
        this.Canvas.height = this.ViewportHeight;
    }

    FrameReset() {
        this.ViewportResized = false;
    }

    FrameUpdate(delta: number) {
        if (this.ViewportWidth != window.innerWidth || this.ViewportHeight != window.innerHeight) {
            this.ViewportWidth = this.Canvas.width = window.innerWidth;
            this.ViewportHeight = this.Canvas.height = window.innerHeight;
            this.ViewportResized = true;
        }

        let now = performance.now();
        sys_control_move(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render_deferred(this, delta);
        sys_render_postprocess(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
