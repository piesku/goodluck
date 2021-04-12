import {create_texture_depth, create_texture_rgba} from "../common/texture.js";
import {
    GL_COLOR_ATTACHMENT0,
    GL_COLOR_ATTACHMENT1,
    GL_CULL_FACE,
    GL_DEPTH_ATTACHMENT,
    GL_DEPTH_TEST,
    GL_FRAMEBUFFER,
    GL_FRAMEBUFFER_COMPLETE,
    GL_TEXTURE_2D,
} from "../common/webgl.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_quad} from "../meshes/quad.js";
import {Camera, RenderTarget} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./loop.js";
import {mat2_deferred_colored} from "./materials/mat2_deferred_colored.js";
import {mat2_deferred_post_shading} from "./materials/mat2_deferred_post_shading.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_control_move} from "./systems/sys_control_move.js";
import {sys_framerate} from "./systems/sys_framerate.js";
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
    MeshCube = mesh_cube(this.Gl);
    MeshQuad = mesh_quad(this.Gl);

    Targets: Record<string, RenderTarget> = {};
    Textures: Record<string, WebGLTexture> = {};

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightColors = new Float32Array(4 * 8);
    LightDirections = new Float32Array(4 * 8);
    Cameras: Array<Camera> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop() : loop_start(this)
        );

        this.Gl.enable(GL_DEPTH_TEST);
        this.Gl.enable(GL_CULL_FACE);

        this.Canvas.width = this.ViewportWidth;
        this.Canvas.height = this.ViewportHeight;

        {
            // Create the main framebuffer for deferred rendering.

            this.Textures.RenderRgba = create_texture_rgba(
                this.Gl,
                this.ViewportWidth,
                this.ViewportHeight
            );
            this.Textures.RenderNormals = create_texture_rgba(
                this.Gl,
                this.ViewportWidth,
                this.ViewportHeight
            );
            this.Textures.RenderDepth = create_texture_depth(
                this.Gl,
                this.ViewportWidth,
                this.ViewportHeight
            );

            let target = (this.Targets.Render = {
                Framebuffer: this.Gl.createFramebuffer()!,
                Width: this.ViewportWidth,
                Height: this.ViewportHeight,
                RenderTexture: this.Textures.RenderRgba,
                NormalsTexture: this.Textures.RenderNormals,
                DepthTexture: this.Textures.RenderDepth,
            });

            this.Gl.bindFramebuffer(GL_FRAMEBUFFER, target.Framebuffer);
            this.Gl.framebufferTexture2D(
                GL_FRAMEBUFFER,
                GL_COLOR_ATTACHMENT0,
                GL_TEXTURE_2D,
                target.RenderTexture,
                0
            );
            this.Gl.framebufferTexture2D(
                GL_FRAMEBUFFER,
                GL_COLOR_ATTACHMENT1,
                GL_TEXTURE_2D,
                target.NormalsTexture,
                0
            );
            this.Gl.framebufferTexture2D(
                GL_FRAMEBUFFER,
                GL_DEPTH_ATTACHMENT,
                GL_TEXTURE_2D,
                target.DepthTexture,
                0
            );

            this.Gl.drawBuffers([GL_COLOR_ATTACHMENT0, GL_COLOR_ATTACHMENT1]);

            if (this.Gl.checkFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE) {
                throw new Error("Failed to set up the framebuffer.");
            }
        }
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
        sys_render_deferred(this, delta);
        sys_render_postprocess(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
