import {
    create_deferred_target,
    create_depth_target,
    create_forward_target,
    create_hdr_target,
    DeferredTarget,
    DepthTarget,
    ForwardTarget,
    HdrTarget,
    RenderTarget,
} from "../common/framebuffer.js";
import {Game3D} from "../common/game.js";
import {mat_deferred_colored} from "../materials/mat_deferred_colored.js";
import {mat_deferred_shading} from "../materials/mat_deferred_shading.js";
import {mat_forward_depth} from "../materials/mat_forward_depth.js";
import {mat_postprocess_blur} from "../materials/mat_postprocess_blur.js";
import {mat_postprocess_brightness} from "../materials/mat_postprocess_brightness.js";
import {mat_postprocess_fxaa} from "../materials/mat_postprocess_fxaa.js";
import {mat_postprocess_tone} from "../materials/mat_postprocess_tone.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_icosphere_smooth} from "../meshes/icosphere_smooth.js";
import {mesh_quad} from "../meshes/quad.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_always} from "./systems/sys_control_always.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_render_deferred} from "./systems/sys_render_deferred.js";
import {sys_render_depth} from "./systems/sys_render_depth.js";
import {sys_render_postprocess} from "./systems/sys_render_postprocess.js";
import {sys_render_shading} from "./systems/sys_render_shading.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_shake} from "./systems/sys_shake.js";
import {sys_spawn} from "./systems/sys_spawn.js";
import {sys_transform} from "./systems/sys_transform.js";
import {sys_ui} from "./systems/sys_ui.js";
import {World} from "./world.js";

export class Game extends Game3D {
    World = new World();

    MaterialDepth = mat_forward_depth(this.Gl);
    MaterialColored = mat_deferred_colored(this.Gl);
    MaterialShading = mat_deferred_shading(this.Gl);
    MaterialPostprocessBrightness = mat_postprocess_brightness(this.Gl);
    MaterialPostprocessBlur = mat_postprocess_blur(this.Gl);
    MaterialPostprocessTone = mat_postprocess_tone(this.Gl);
    MaterialPostprocessFXAA = mat_postprocess_fxaa(this.Gl);

    MeshSphereSmooth = mesh_icosphere_smooth(this.Gl);
    MeshCube = mesh_cube(this.Gl);
    MeshQuad = mesh_quad(this.Gl);

    Textures: Record<string, WebGLTexture> = {};
    override Targets: {
        [name: string]: RenderTarget;
        Gbuffer: DeferredTarget;
        Shaded: HdrTarget;
        Brightness: HdrTarget;
        Ping: HdrTarget;
        Pong: HdrTarget;
        Toned: ForwardTarget;
        Sun: DepthTarget;
        Back: DepthTarget;
    };

    LightCount = 0;

    constructor() {
        super();

        // Required for floating point g-buffer textures.
        this.Gl.getExtension("EXT_color_buffer_float");
        this.Targets = {
            // Create the main framebuffer for deferred rendering.
            Gbuffer: create_deferred_target(this.Gl, this.ViewportWidth, this.ViewportHeight, true),
            Shaded: create_hdr_target(this.Gl, this.ViewportWidth, this.ViewportHeight, true),
            Brightness: create_hdr_target(this.Gl, this.ViewportWidth, this.ViewportHeight, true),
            Ping: create_hdr_target(this.Gl, this.ViewportWidth, this.ViewportHeight, true),
            Pong: create_hdr_target(this.Gl, this.ViewportWidth, this.ViewportHeight, true),
            Toned: create_forward_target(this.Gl, this.ViewportWidth, this.ViewportHeight, true),
            Sun: create_depth_target(this.Gl, 1024, 1024),
            Back: create_depth_target(this.Gl, 256, 256),
        };
    }

    override FrameUpdate(delta: number) {
        sys_resize(this, delta);
        sys_camera(this, delta);

        sys_control_always(this, delta);

        sys_move(this, delta);
        sys_shake(this, delta);
        sys_spawn(this, delta);
        sys_transform(this, delta);

        sys_render_depth(this, delta);
        sys_render_deferred(this, delta);
        sys_render_shading(this, delta);
        sys_render_postprocess(this, delta);
        sys_ui(this, delta);
    }
}
