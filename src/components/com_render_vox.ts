import {Entity, Game} from "../game.js";
import {Material, Shape} from "../materials/mat_common.js";
import {Mat} from "../materials/mat_index.js";
import {Model} from "../model.js";
import {Cube} from "../shapes/Cube.js";
import {GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT, GL_STATIC_DRAW} from "../webgl.js";
import {Get} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderInstanced {
    readonly Kind: RenderKind.Instanced;
    readonly Material: Material;
    readonly VAO: WebGLVertexArrayObject;
    readonly IndexCount: number;
    readonly InstanceCount: number;
    readonly Palette?: Array<number>;
}

export function render_vox(model: Model, Palette?: Array<number>) {
    let shape = Cube;
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.Render;
        game[Get.Render][entity] = <RenderInstanced>{
            Kind: RenderKind.Instanced,
            Material: game.Materials[Mat.Instanced],
            VAO: buffer(game.GL, shape, model),
            IndexCount: shape.Indices.length,
            InstanceCount: model.length / 4,
            Palette,
        };
    };
}

export const enum InstancedAttribute {
    Position = 1,
    Normal = 2,
    Offset = 3,
}

export const enum InstancedUniform {
    PV,
    World,
    Self,
    Palette,
    LightCount,
    LightPositions,
    LightDetails,
}

function buffer(gl: WebGL2RenderingContext, shape: Shape, offsets: Float32Array) {
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(GL_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(GL_ARRAY_BUFFER, shape.Vertices, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(InstancedAttribute.Position);
    gl.vertexAttribPointer(InstancedAttribute.Position, 3, GL_FLOAT, false, 0, 0);

    gl.bindBuffer(GL_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(GL_ARRAY_BUFFER, shape.Normals, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(InstancedAttribute.Normal);
    gl.vertexAttribPointer(InstancedAttribute.Normal, 3, GL_FLOAT, false, 0, 0);

    gl.bindBuffer(GL_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(GL_ARRAY_BUFFER, offsets, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(InstancedAttribute.Offset);
    gl.vertexAttribPointer(InstancedAttribute.Offset, 4, GL_FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(InstancedAttribute.Offset, 1);

    gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, shape.Indices, GL_STATIC_DRAW);

    gl.bindVertexArray(null);
    return vao;
}
