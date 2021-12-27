import {Game3D} from "../common/game.js";
import {GL_ARRAY_BUFFER, GL_FLOAT, GL_STATIC_DRAW, GL_STREAM_DRAW} from "../common/webgl.js";
import {mat_instanced2d} from "./materials/mat_instanced2d.js";
import {sys_camera2d} from "./systems/sys_camera2d.js";
import {sys_control_always2d} from "./systems/sys_control_always2d.js";
import {sys_control_player} from "./systems/sys_control_player.js";
import {sys_move2d} from "./systems/sys_move2d.js";
import {sys_physics2d_integrate} from "./systems/sys_physics2d_integrate.js";
import {sys_render2d} from "./systems/sys_render2d.js";
import {sys_resize2d} from "./systems/sys_resize2d.js";
import {sys_transform2d} from "./systems/sys_transform2d.js";
import {World} from "./world.js";

export const WORLD_CAPACITY = 50_001;
export const FLOATS_PER_INSTANCE = 16;
export const BYTES_PER_INSTANCE = FLOATS_PER_INSTANCE * 4;

export class Game extends Game3D {
    World = new World(WORLD_CAPACITY);

    MaterialInstanced = mat_instanced2d(this.Gl);

    Textures: Record<string, WebGLTexture> = {};

    InstanceData = new Float32Array(this.World.Capacity * FLOATS_PER_INSTANCE);
    InstanceBuffer = this.Gl.createBuffer()!;

    constructor() {
        super();

        let material = this.MaterialInstanced;

        // Vertex positions and texture coordinates.
        let vertex_buf = this.Gl.createBuffer()!;
        this.Gl.bindBuffer(GL_ARRAY_BUFFER, vertex_buf);
        this.Gl.bufferData(GL_ARRAY_BUFFER, vertex_arr, GL_STATIC_DRAW);
        this.Gl.enableVertexAttribArray(material.Locations.VertexPosition);
        this.Gl.vertexAttribPointer(
            material.Locations.VertexPosition,
            3,
            GL_FLOAT,
            false,
            4 * 5,
            0
        );
        this.Gl.enableVertexAttribArray(material.Locations.VertexTexcoord);
        this.Gl.vertexAttribPointer(
            material.Locations.VertexTexcoord,
            2,
            GL_FLOAT,
            false,
            4 * 5,
            4 * 3
        );

        // Instance data.
        this.Gl.bindBuffer(GL_ARRAY_BUFFER, this.InstanceBuffer);
        this.Gl.bufferData(
            GL_ARRAY_BUFFER,
            this.World.Capacity * BYTES_PER_INSTANCE,
            GL_STREAM_DRAW
        );

        this.Gl.enableVertexAttribArray(material.Locations.InstanceRotation);
        this.Gl.vertexAttribDivisor(material.Locations.InstanceRotation, 1);
        this.Gl.vertexAttribPointer(
            material.Locations.InstanceRotation,
            4,
            GL_FLOAT,
            false,
            BYTES_PER_INSTANCE,
            0
        );

        this.Gl.enableVertexAttribArray(material.Locations.InstanceTranslation);
        this.Gl.vertexAttribDivisor(material.Locations.InstanceTranslation, 1);
        this.Gl.vertexAttribPointer(
            material.Locations.InstanceTranslation,
            4,
            GL_FLOAT,
            false,
            BYTES_PER_INSTANCE,
            4 * 4
        );

        this.Gl.enableVertexAttribArray(material.Locations.InstanceColor);
        this.Gl.vertexAttribDivisor(material.Locations.InstanceColor, 1);
        this.Gl.vertexAttribPointer(
            material.Locations.InstanceColor,
            4,
            GL_FLOAT,
            false,
            BYTES_PER_INSTANCE,
            4 * 8
        );
    }

    override FrameUpdate(delta: number) {
        sys_resize2d(this, delta);
        sys_camera2d(this, delta);

        sys_control_player(this, delta);
        sys_control_always2d(this, delta);

        sys_move2d(this, delta);
        sys_physics2d_integrate(this, delta);
        sys_transform2d(this, delta);

        sys_render2d(this, delta);
    }
}

// prettier-ignore
let vertex_arr = Float32Array.from([
    -0.5, -0.5, 0,    0, 0,    // SW
    0.5, -0.5, 0,     1, 0,    // SE
    -0.5, 0.5, 0,     0, 1,    // NW
    0.5, 0.5, 0,      1, 1     // NE
]);
