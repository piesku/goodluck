import {Game3D} from "../lib/game.js";
import {create_spritesheet_from} from "../lib/texture.js";
import {GL_BLEND, GL_DEPTH_TEST} from "../lib/webgl.js";
import {FLOATS_PER_INSTANCE, setup_render2d_buffers} from "../materials/layout2d.js";
import {mat_render2d} from "../materials/mat_render2d.js";
import {sys_camera2d} from "./systems/sys_camera2d.js";
import {sys_control_player} from "./systems/sys_control_player.js";
import {sys_draw2d} from "./systems/sys_draw2d.js";
import {sys_physics2d_bounds} from "./systems/sys_physics2d_bounds.js";
import {sys_physics2d_integrate} from "./systems/sys_physics2d_integrate.js";
import {sys_render2d} from "./systems/sys_render2d.js";
import {sys_resize2d} from "./systems/sys_resize2d.js";
import {sys_transform2d} from "./systems/sys_transform2d.js";
import {Has, World} from "./world.js";

export const WORLD_CAPACITY = 65_536; // = 4MB of InstanceData.

export class Game extends Game3D {
    World = new World(WORLD_CAPACITY);

    MaterialRender2D = mat_render2d(this.Gl, Has.Render2D, Has.SpatialNode2D);
    Spritesheet = create_spritesheet_from(this.Gl, document.querySelector("img")!);

    InstanceData = new Float32Array(this.World.Capacity * FLOATS_PER_INSTANCE);
    InstanceBuffer = this.Gl.createBuffer()!;

    SceneWidth = 32;
    SceneHeight = 32;

    constructor() {
        super();

        this.Gl.clearColor(0, 0, 0, 0);
        this.Gl.enable(GL_BLEND);
        this.Gl.disable(GL_DEPTH_TEST);
        setup_render2d_buffers(this.Gl, this.InstanceBuffer);
    }

    override FixedUpdate(delta: number) {
        sys_physics2d_integrate(this, delta);
        sys_physics2d_bounds(this, delta);
        sys_transform2d(this, delta);
    }

    override FrameUpdate(delta: number) {
        sys_resize2d(this, delta);
        sys_camera2d(this, delta);
        sys_control_player(this, delta);
        sys_transform2d(this, delta);
        sys_draw2d(this, delta);
        sys_render2d(this, delta);
    }
}
