import {Game3D} from "../common/game.js";
import {GL_ARRAY_BUFFER, GL_DYNAMIC_DRAW, GL_FLOAT, GL_STATIC_DRAW} from "../common/webgl.js";
import {Entity} from "../common/world.js";
import {mat_instanced2d} from "./materials/mat_instanced2d.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_render2d} from "./systems/sys_render2d.js";
import {sys_resize} from "./systems/sys_resize.js";
import {sys_transform} from "./systems/sys_transform.js";
import {World} from "./world.js";

const BYTES_PER_INSTANCE = 4 * 20;

export class Game extends Game3D {
    World = new World();

    MaterialInstanced = mat_instanced2d(this.Gl);

    InstanceCount = 100_000;
    InstanceData = new Float32Array(this.InstanceCount * 20);
    InstanceBuffer = this.Gl.createBuffer()!;
    Vao = this.Gl.createVertexArray()!;

    Cameras: Array<Entity> = [];

    constructor() {
        super();

        let material = this.MaterialInstanced;
        this.Gl.bindVertexArray(this.Vao);

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

        // Instance data: the world matrix (as 4 vec4s).
        this.Gl.bindBuffer(GL_ARRAY_BUFFER, this.InstanceBuffer);
        this.Gl.bufferData(
            GL_ARRAY_BUFFER,
            this.InstanceCount * BYTES_PER_INSTANCE,
            GL_DYNAMIC_DRAW
        );

        this.Gl.enableVertexAttribArray(material.Locations.InstanceColumn1);
        this.Gl.vertexAttribDivisor(material.Locations.InstanceColumn1, 1);
        this.Gl.vertexAttribPointer(
            material.Locations.InstanceColumn1,
            4,
            GL_FLOAT,
            false,
            BYTES_PER_INSTANCE,
            0
        );

        this.Gl.enableVertexAttribArray(material.Locations.InstanceColumn2);
        this.Gl.vertexAttribDivisor(material.Locations.InstanceColumn2, 1);
        this.Gl.vertexAttribPointer(
            material.Locations.InstanceColumn2,
            4,
            GL_FLOAT,
            false,
            BYTES_PER_INSTANCE,
            4 * 4
        );

        this.Gl.enableVertexAttribArray(material.Locations.InstanceColumn3);
        this.Gl.vertexAttribDivisor(material.Locations.InstanceColumn3, 1);
        this.Gl.vertexAttribPointer(
            material.Locations.InstanceColumn3,
            4,
            GL_FLOAT,
            false,
            BYTES_PER_INSTANCE,
            4 * 8
        );

        this.Gl.enableVertexAttribArray(material.Locations.InstanceColumn4);
        this.Gl.vertexAttribDivisor(material.Locations.InstanceColumn4, 1);
        this.Gl.vertexAttribPointer(
            material.Locations.InstanceColumn4,
            4,
            GL_FLOAT,
            false,
            BYTES_PER_INSTANCE,
            4 * 12
        );

        this.Gl.enableVertexAttribArray(material.Locations.InstanceColor);
        this.Gl.vertexAttribDivisor(material.Locations.InstanceColor, 1);
        this.Gl.vertexAttribPointer(
            material.Locations.InstanceColor,
            4,
            GL_FLOAT,
            false,
            BYTES_PER_INSTANCE,
            4 * 16
        );

        this.Gl.bindVertexArray(null);
    }

    override FrameUpdate(delta: number) {
        sys_transform(this, delta);
        sys_resize(this, delta);
        sys_camera(this, delta);
        sys_render2d(this, delta);
    }
}

// prettier-ignore
let vertex_arr = Float32Array.from([
    -1, -1, 0,    0, 0,    // SW
    1, -1, 0,     1, 0,    // SE
    -1, 1, 0,     0, 1,    // NW
    1, 1, 0,      1, 1     // NE
]);
