import {create_render_buffer, create_texture_rgba} from "../common/texture.js";
import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_plane} from "../meshes/plane.js";
import {Camera} from "./components/com_camera.js";
import {loop_start, loop_stop} from "./core.js";
import {mat1_textured} from "./materials/mat1_textured.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_framerate} from "./systems/sys_framerate.js";
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

    Canvas = document.querySelector("canvas")!;
    Gl = this.Canvas.getContext("webgl")!;
    ExtVao = this.Gl.getExtension("OES_vertex_array_object")!;

    MaterialTextured = mat1_textured(this.Gl);
    MeshCube = mesh_cube(this.Gl);
    MeshPlane = mesh_plane(this.Gl);

    Textures: Record<string, WebGLTexture> = {
        Minimap: create_texture_rgba(this.Gl, 256, 256),
    };
    RenderBuffers: Record<string, WebGLRenderbuffer> = {
        Minimap: create_render_buffer(this.Gl, 256, 256),
    };

    Cameras: Array<Camera> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop(this) : loop_start(this)
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
        sys_render(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
