import {Game3D} from "../lib/game.js";
import {create_spritesheet_from} from "../lib/texture.js";
import {
    GL_BLEND,
    GL_CULL_FACE,
    GL_DEPTH_TEST,
    GL_ONE_MINUS_SRC_ALPHA,
    GL_SRC_ALPHA,
} from "../lib/webgl.js";
import {setup_render2d_buffers} from "../materials/layout2d.js";
import {mat_render2d} from "../materials/mat_render2d.js";
import {sys_camera2d} from "./systems/sys_camera2d.js";
import {sys_collide2d} from "./systems/sys_collide2d.js";
import {sys_control_always2d} from "./systems/sys_control_always2d.js";
import {sys_control_camera} from "./systems/sys_control_camera.js";
import {sys_control_keyboard} from "./systems/sys_control_keyboard.js";
import {sys_control_mouse} from "./systems/sys_control_mouse.js";
import {sys_draw2d} from "./systems/sys_draw2d.js";
import {sys_lifespan} from "./systems/sys_lifespan.js";
import {sys_move2d} from "./systems/sys_move2d.js";
import {sys_physics2d_bounds} from "./systems/sys_physics2d_bounds.js";
import {sys_physics2d_integrate} from "./systems/sys_physics2d_integrate.js";
import {sys_physics2d_resolve} from "./systems/sys_physics2d_resolve.js";
import {sys_poll} from "./systems/sys_poll.js";
import {sys_render2d} from "./systems/sys_render2d.js";
import {sys_render2d_animate} from "./systems/sys_render2d_animate.js";
import {sys_resize2d} from "./systems/sys_resize2d.js";
import {sys_shake2d} from "./systems/sys_shake2d.js";
import {sys_spawn2d} from "./systems/sys_spawn2d.js";
import {sys_toggle} from "./systems/sys_toggle.js";
import {sys_transform2d} from "./systems/sys_transform2d.js";
import {sys_trigger2d} from "./systems/sys_trigger2d.js";
import {sys_ui} from "./systems/sys_ui.js";
import {Has, World} from "./world.js";

export const WORLD_CAPACITY = 65_536; // = 4MB of InstanceData.
export const REAL_UNIT_SIZE = 18;

export class Game extends Game3D {
    World = new World(WORLD_CAPACITY);

    MaterialRender2D = mat_render2d(this.Gl, Has.Render2D, Has.SpatialNode2D);
    Spritesheet = create_spritesheet_from(this.Gl, document.querySelector("img")!);

    InstanceBuffer = this.Gl.createBuffer()!;
    UnitSize = REAL_UNIT_SIZE;

    constructor() {
        super();

        this.Gl.clearColor(0, 0, 0, 0);
        this.Gl.disable(GL_DEPTH_TEST);
        this.Gl.disable(GL_CULL_FACE);
        this.Gl.enable(GL_BLEND);
        this.Gl.blendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

        setup_render2d_buffers(this.Gl, this.InstanceBuffer);
    }

    override FrameUpdate(delta: number) {
        // Event loop.
        sys_poll(this, delta);

        // Collisions and physics.
        sys_physics2d_integrate(this, delta);
        sys_physics2d_bounds(this, delta);
        sys_transform2d(this, delta);
        sys_collide2d(this, delta);
        sys_physics2d_resolve(this, delta);
        sys_trigger2d(this, delta);

        // Player input.
        sys_control_keyboard(this, delta);
        sys_control_mouse(this, delta);
        sys_control_camera(this, delta);

        // AI.
        sys_control_always2d(this, delta);

        // Game logic.
        sys_move2d(this, delta);
        sys_lifespan(this, delta);
        sys_shake2d(this, delta);
        sys_toggle(this, delta);
        sys_spawn2d(this, delta);

        // Commit all positions.
        sys_transform2d(this, delta);

        // Camera.
        sys_resize2d(this, delta);
        sys_camera2d(this, delta);

        // Rendering.
        sys_draw2d(this, delta);
        sys_render2d_animate(this, delta);
        sys_render2d(this, delta);
        sys_ui(this, delta);
    }
}

export const enum Layer {
    None = 0,
    Terrain = 1,
    Player = 2,
    Object = 4,
}
