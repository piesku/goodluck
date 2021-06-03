import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mat1_forward_colored_gouraud} from "../materials/mat1_forward_colored_gouraud.js";
import {mat1_forward_colored_line} from "../materials/mat1_forward_colored_unlit.js";
import {mesh_cube} from "../meshes/cube.js";
import {mesh_terrain} from "../meshes/terrain.js";
import {frame_reset, frame_setup, input_init, loop_init} from "./impl.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_control_camera} from "./systems/sys_control_camera.js";
import {sys_control_keyboard} from "./systems/sys_control_keyboard.js";
import {sys_control_mouse} from "./systems/sys_control_mouse.js";
import {sys_control_player} from "./systems/sys_control_player.js";
import {sys_control_touch} from "./systems/sys_control_touch.js";
import {sys_draw} from "./systems/sys_draw.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_highlight} from "./systems/sys_highlight.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_nav} from "./systems/sys_nav.js";
import {Picked, sys_pick} from "./systems/sys_pick.js";
import {sys_render_forward} from "./systems/sys_render1_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_select} from "./systems/sys_select.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

export type Entity = number;

export class Game {
    World = new World();

    ViewportWidth = window.innerWidth;
    ViewportHeight = window.innerHeight;
    ViewportResized = true;

    InputState: Record<string, number> = {};
    InputDelta: Record<string, number> = {};
    InputDistance: Record<string, number> = {};
    InputTouches: Record<string, number> = {};

    Ui = document.querySelector("main")!;
    Canvas = document.querySelector("#scene")! as HTMLCanvasElement;
    Gl = this.Canvas.getContext("webgl")!;
    ExtVao = this.Gl.getExtension("OES_vertex_array_object")!;

    Billboard = document.querySelector("#billboard")! as HTMLCanvasElement;
    Context2D = this.Billboard.getContext("2d")!;

    MaterialColoredLine = mat1_forward_colored_line(this.Gl);
    MaterialColoredGouraud = mat1_forward_colored_gouraud(this.Gl);
    MeshCube = mesh_cube(this.Gl);
    MeshTerrain = mesh_terrain(this.Gl);

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Entity> = [];

    CameraZoom = 1;
    Picked?: Picked;
    Selected?: Entity;

    constructor() {
        loop_init(this);
        input_init(this);

        this.Gl.enable(GL_DEPTH_TEST);
        this.Gl.enable(GL_CULL_FACE);
    }

    FrameUpdate(delta: number) {
        frame_setup(this);
        let now = performance.now();

        // Camera picking.
        sys_control_camera(this, delta);
        sys_control_keyboard(this, delta);
        sys_control_mouse(this, delta);
        sys_control_touch(this, delta);
        sys_pick(this, delta);

        // Player order.
        sys_control_player(this, delta);
        sys_select(this, delta);
        sys_highlight(this, delta);

        // Game logic.
        sys_nav(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        sys_collide(this, delta);

        // Rendering.
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render_forward(this, delta);
        sys_draw(this, delta);

        sys_framerate(this, delta, performance.now() - now);
        frame_reset(this);
    }
}

export const enum Layer {
    None = 0,
}
