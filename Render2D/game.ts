import {Game3D} from "../common/game.js";
import {create_spritesheet_from} from "../common/texture.js";
import {GL_BLEND} from "../common/webgl.js";
import {FLOATS_PER_INSTANCE, setup_render2d_buffers} from "../materials/layout2d.js";
import {mat_instanced2d} from "./materials/mat_instanced2d.js";
import {sys_animate2d_sprite} from "./systems/sys_animate2d_sprite.js";
import {sys_camera2d} from "./systems/sys_camera2d.js";
import {sys_control_always2d} from "./systems/sys_control_always2d.js";
import {sys_control_player} from "./systems/sys_control_player.js";
import {sys_draw2d} from "./systems/sys_draw2d.js";
import {sys_move2d} from "./systems/sys_move2d.js";
import {sys_physics2d_bounds} from "./systems/sys_physics2d_bounds.js";
import {sys_physics2d_integrate} from "./systems/sys_physics2d_integrate.js";
import {sys_render2d} from "./systems/sys_render2d.js";
import {sys_resize2d} from "./systems/sys_resize2d.js";
import {sys_transform2d} from "./systems/sys_transform2d.js";
import {World} from "./world.js";

export const WORLD_CAPACITY = 65_536; // = 4MB of InstanceData.

export class Game extends Game3D {
    World = new World(WORLD_CAPACITY);

    MaterialInstanced = mat_instanced2d(this.Gl);
    Spritesheet = create_spritesheet_from(this.Gl, document.querySelector("img")!);

    InstanceData = new Float32Array(this.World.Capacity * FLOATS_PER_INSTANCE);
    InstanceBuffer = this.Gl.createBuffer()!;

    SceneWidth = 32;
    SceneHeight = 32;

    constructor() {
        super();

        this.Gl.clearColor(0, 0, 0, 0);
        this.Gl.enable(GL_BLEND);
        setup_render2d_buffers(this.Gl, this.InstanceBuffer);
    }

    override FixedUpdate(delta: number) {
        sys_physics2d_integrate(this, delta);
        sys_transform2d(this, delta);
        sys_physics2d_bounds(this, delta);
    }

    override FrameUpdate(delta: number) {
        sys_resize2d(this, delta);
        sys_camera2d(this, delta);
        sys_control_player(this, delta);
        sys_control_always2d(this, delta);
        sys_animate2d_sprite(this, delta);
        sys_move2d(this, delta);
        sys_draw2d(this, delta);
        sys_render2d(this, delta);
    }
}
