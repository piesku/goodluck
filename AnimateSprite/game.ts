import {Game3D} from "../common/game.js";
import {create_spritesheet_from} from "../common/texture.js";
import {GL_BLEND} from "../common/webgl.js";
import {FLOATS_PER_INSTANCE, setup_render2d_buffers} from "../materials/layout2d.js";
import {mat_render2d} from "../materials/mat_render2d.js";
import {sys_animate2d_sprite} from "./systems/sys_animate2d_sprite.js";
import {sys_camera2d} from "./systems/sys_camera2d.js";
import {sys_draw2d} from "./systems/sys_draw2d.js";
import {sys_render2d} from "./systems/sys_render2d.js";
import {sys_resize2d} from "./systems/sys_resize2d.js";
import {sys_transform2d} from "./systems/sys_transform2d.js";
import {Has, World} from "./world.js";

export const WORLD_CAPACITY = 128;

export class Game extends Game3D {
    World = new World(WORLD_CAPACITY);

    MaterialRender2D = mat_render2d(this.Gl, Has.Render2D, Has.SpatialNode2D);
    Spritesheet = create_spritesheet_from(this.Gl, document.querySelector("img")!);

    InstanceData = new Float32Array(this.World.Capacity * FLOATS_PER_INSTANCE);
    InstanceBuffer = this.Gl.createBuffer()!;

    constructor() {
        super();

        this.Gl.clearColor(0, 0, 0, 0);
        this.Gl.enable(GL_BLEND);
        setup_render2d_buffers(this.Gl, this.InstanceBuffer);
    }

    override FrameUpdate(delta: number) {
        sys_resize2d(this, delta);
        sys_camera2d(this, delta);
        sys_animate2d_sprite(this, delta);
        sys_transform2d(this, delta);
        sys_draw2d(this, delta);
        sys_render2d(this, delta);
    }
}

export const enum Layer {
    None = 0,
    Terrain = 1,
    Object = 2,
}
