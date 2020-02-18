import {Material, Mesh} from "../../common/material.js";
import {
    GL_ARRAY_BUFFER,
    GL_ELEMENT_ARRAY_BUFFER,
    GL_FLOAT,
    GL_STATIC_DRAW,
} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {Model} from "../model.js";
import {Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderInstanced {
    readonly Kind: RenderKind.Instanced;
    readonly Material: Material;
    readonly Mesh: Mesh;
    readonly VAO: WebGLVertexArrayObject;
    readonly InstanceCount: number;
    readonly Palette: Array<number>;
}

export function render_instanced(Mesh: Mesh, offsets: Model, Palette?: Array<number>) {
    return (game: Game, entity: Entity) => {
        // We can't cache the VAO per mesh, like we do in com_render_shaded in
        // other examples, because the offsets vary between the instances of the
        // component.
        // Hint: If offset models are guaranteed to only ever be rendered using
        // the same mesh as atoms (e.g. a model of a horse is always rendered
        // using cube voxels), it might be beneficial to cache VAOs per model.
        let VAO = game.GL.createVertexArray();
        game.GL.bindVertexArray(VAO);

        game.GL.bindBuffer(GL_ARRAY_BUFFER, Mesh.Vertices);
        game.GL.enableVertexAttribArray(InstancedAttribute.Position);
        game.GL.vertexAttribPointer(InstancedAttribute.Position, 3, GL_FLOAT, false, 0, 0);

        game.GL.bindBuffer(GL_ARRAY_BUFFER, Mesh.Normals);
        game.GL.enableVertexAttribArray(InstancedAttribute.Normal);
        game.GL.vertexAttribPointer(InstancedAttribute.Normal, 3, GL_FLOAT, false, 0, 0);

        game.GL.bindBuffer(GL_ARRAY_BUFFER, game.GL.createBuffer());
        game.GL.bufferData(GL_ARRAY_BUFFER, offsets, GL_STATIC_DRAW);
        game.GL.enableVertexAttribArray(InstancedAttribute.Offset);
        game.GL.vertexAttribPointer(InstancedAttribute.Offset, 4, GL_FLOAT, false, 0, 0);
        game.GL.vertexAttribDivisor(InstancedAttribute.Offset, 1);

        game.GL.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, Mesh.Indices);

        game.GL.bindVertexArray(null);
        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = <RenderInstanced>{
            Kind: RenderKind.Instanced,
            Material: game.MaterialInstanced,
            Mesh,
            VAO,
            InstanceCount: offsets.length / 4,
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
