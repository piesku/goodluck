import {GL_CULL_FACE, GL_DEPTH_TEST} from "../common/webgl.js";
import {mat1_forward_colored_gouraud} from "../materials/mat1_forward_colored_gouraud.js";
import {mesh_cube} from "../meshes/cube.js";
import {frame_reset, frame_setup, input_init, input_pointer_lock, loop_init} from "./impl.js";
import {sys_animate} from "./systems/sys_animate.js";
import {sys_audio_listener} from "./systems/sys_audio_listener.js";
import {sys_audio_source} from "./systems/sys_audio_source.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_control_always} from "./systems/sys_control_always.js";
import {sys_control_keyboard} from "./systems/sys_control_keyboard.js";
import {sys_control_mouse} from "./systems/sys_control_mouse.js";
import {sys_control_spawn} from "./systems/sys_control_spawn.js";
import {sys_control_touch} from "./systems/sys_control_touch.js";
import {sys_control_xbox} from "./systems/sys_control_xbox.js";
import {sys_draw} from "./systems/sys_draw.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_lifespan} from "./systems/sys_lifespan.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_mimic} from "./systems/sys_mimic.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_physics_integrate} from "./systems/sys_physics_integrate.js";
import {sys_physics_kinematic} from "./systems/sys_physics_kinematic.js";
import {sys_physics_resolve} from "./systems/sys_physics_resolve.js";
import {sys_poll} from "./systems/sys_poll.js";
import {sys_render_forward} from "./systems/sys_render1_forward.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_shake} from "./systems/sys_shake.js";
import {sys_toggle} from "./systems/sys_toggle.js";
import {sys_transform} from "./systems/sys_transform.js";
import {sys_trigger} from "./systems/sys_trigger.js";
import {sys_ui} from "./systems/sys_ui.js";
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
    Billboard = document.querySelector("#billboard")! as HTMLCanvasElement;
    Context2D = this.Billboard.getContext("2d")!;
    Canvas = document.querySelector("#scene")! as HTMLCanvasElement;
    Gl = this.Canvas.getContext("webgl")!;
    ExtVao = this.Gl.getExtension("OES_vertex_array_object")!;
    Audio = new (window["AudioContext"] || window.webkitAudioContext)();

    MaterialColoredGouraud = mat1_forward_colored_gouraud(this.Gl);

    MeshCube = mesh_cube(this.Gl);

    // The rendering pipeline supports 8 lights.
    LightPositions = new Float32Array(4 * 8);
    LightDetails = new Float32Array(4 * 8);
    Cameras: Array<Entity> = [];

    constructor() {
        loop_init(this);
        input_init(this);
        input_pointer_lock(this);

        this.Gl.enable(GL_DEPTH_TEST);
        this.Gl.enable(GL_CULL_FACE);
    }

    FrameUpdate(delta: number) {
        frame_setup(this);
        let now = performance.now();

        // Event loop.
        sys_poll(this, delta);

        // Player input.
        sys_control_keyboard(this, delta);
        sys_control_mouse(this, delta);
        sys_control_xbox(this, delta);
        sys_control_touch(this, delta);

        // AI.
        sys_control_always(this, delta);
        sys_control_spawn(this, delta);

        // Game logic.
        sys_animate(this, delta);
        sys_move(this, delta);
        sys_mimic(this, delta);
        sys_lifespan(this, delta);
        sys_shake(this, delta);
        sys_toggle(this, delta);
        sys_transform(this, delta);

        // Collisions and physics.
        sys_physics_integrate(this, delta);
        sys_transform(this, delta);
        sys_physics_kinematic(this, delta);
        sys_collide(this, delta);
        sys_physics_resolve(this, delta);
        sys_transform(this, delta);
        sys_trigger(this, delta);

        // Rendering.
        sys_audio_listener(this, delta);
        sys_audio_source(this, delta);
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render_forward(this, delta);
        sys_draw(this, delta);
        sys_ui(this, delta);

        sys_framerate(this, delta, performance.now() - now);
        frame_reset(this);
    }
}
export const enum Layer {
    None = 0,
    Player = 1,
    Terrain = 2,
    Obstacle = 4,
    Collectable = 8,
}
