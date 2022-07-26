import {Game3D} from "../common/game.js";
import {create_spritesheet_from} from "../common/texture.js";
import {
    GL_ARRAY_BUFFER,
    GL_BLEND,
    GL_FLOAT,
    GL_STATIC_DRAW,
    GL_STREAM_DRAW,
} from "../common/webgl.js";
import {Attribute} from "../materials/layout2d.js";
import {mat_instanced2d} from "./materials/mat_instanced2d.js";
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
export const FLOATS_PER_INSTANCE = 16;
export const BYTES_PER_INSTANCE = FLOATS_PER_INSTANCE * 4;
export const UNIT_PX = 32;

export class Game extends Game3D {
    World = new World(WORLD_CAPACITY);

    MaterialInstanced = mat_instanced2d(this.Gl);
    Spritesheet = create_spritesheet_from(this.Gl, document.querySelector("img")!);

    InstanceData = new Float32Array(this.World.Capacity * FLOATS_PER_INSTANCE);
    InstanceBuffer = this.Gl.createBuffer()!;

    constructor() {
        super();

        this.Gl.enable(GL_BLEND);

        // Vertex positions and texture coordinates.
        let vertex_buf = this.Gl.createBuffer()!;
        this.Gl.bindBuffer(GL_ARRAY_BUFFER, vertex_buf);
        this.Gl.bufferData(GL_ARRAY_BUFFER, vertex_arr, GL_STATIC_DRAW);
        this.Gl.enableVertexAttribArray(Attribute.VertexPosition);
        this.Gl.vertexAttribPointer(Attribute.VertexPosition, 3, GL_FLOAT, false, 4 * 5, 0);
        this.Gl.enableVertexAttribArray(Attribute.VertexTexCoord);
        this.Gl.vertexAttribPointer(Attribute.VertexTexCoord, 2, GL_FLOAT, false, 4 * 5, 4 * 3);

        // Instance data.
        this.Gl.bindBuffer(GL_ARRAY_BUFFER, this.InstanceBuffer);
        this.Gl.bufferData(
            GL_ARRAY_BUFFER,
            this.World.Capacity * BYTES_PER_INSTANCE,
            GL_STREAM_DRAW
        );

        this.Gl.enableVertexAttribArray(Attribute.InstanceRotation);
        this.Gl.vertexAttribDivisor(Attribute.InstanceRotation, 1);
        this.Gl.vertexAttribPointer(
            Attribute.InstanceRotation,
            4,
            GL_FLOAT,
            false,
            BYTES_PER_INSTANCE,
            0
        );

        this.Gl.enableVertexAttribArray(Attribute.InstanceTranslation);
        this.Gl.vertexAttribDivisor(Attribute.InstanceTranslation, 1);
        this.Gl.vertexAttribPointer(
            Attribute.InstanceTranslation,
            4,
            GL_FLOAT,
            false,
            BYTES_PER_INSTANCE,
            4 * 4
        );

        this.Gl.enableVertexAttribArray(Attribute.InstanceColor);
        this.Gl.vertexAttribDivisor(Attribute.InstanceColor, 1);
        this.Gl.vertexAttribPointer(
            Attribute.InstanceColor,
            4,
            GL_FLOAT,
            false,
            BYTES_PER_INSTANCE,
            4 * 8
        );

        this.Gl.enableVertexAttribArray(Attribute.InstanceSprite);
        this.Gl.vertexAttribDivisor(Attribute.InstanceSprite, 1);
        this.Gl.vertexAttribPointer(
            Attribute.InstanceSprite,
            4,
            GL_FLOAT,
            false,
            BYTES_PER_INSTANCE,
            4 * 12
        );
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
        sys_move2d(this, delta);
        sys_draw2d(this, delta);
        sys_render2d(this, delta);
    }
}

// Texcoords are +Y=down for compatibility with spritesheet map coordinates.
// prettier-ignore
let vertex_arr = Float32Array.from([
    -0.5, -0.5, 0,    0, 1,    // SW
    0.5, -0.5, 0,     1, 1,    // SE
    -0.5, 0.5, 0,     0, 0,    // NW
    0.5, 0.5, 0,      1, 0     // NE
]);
