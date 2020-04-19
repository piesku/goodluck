import {Material, Mesh} from "../../common/material.js";
import {
    GL_ARRAY_BUFFER,
    GL_CW,
    GL_ELEMENT_ARRAY_BUFFER,
    GL_FLOAT,
    GL_STATIC_DRAW,
} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {InstancedLayout} from "../materials/layout_instanced.js";
import {Model} from "../model.js";
import {Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderInstanced {
    readonly Kind: RenderKind.Instanced;
    readonly Material: Material<InstancedLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly VAO: WebGLVertexArrayObject;
    readonly InstanceCount: number;
    readonly Palette: Array<number>;
}

export function render_instanced(mesh: Mesh, offsets: Model, palette: Array<number>) {
    return (game: Game, entity: Entity) => {
        let material = game.MaterialInstanced;

        // We can't cache the VAO per mesh, like we do in com_render_shaded in
        // other examples, because the offsets vary between the instances of the
        // component.
        // Hint: If offset models are guaranteed to only ever be rendered using
        // the same mesh as atoms (e.g. a model of a horse is always rendered
        // using cube voxels), it might be beneficial to cache VAOs per model.
        let vao = game.GL.createVertexArray()!;
        game.GL.bindVertexArray(vao);

        game.GL.bindBuffer(GL_ARRAY_BUFFER, mesh.VertexBuffer);
        game.GL.enableVertexAttribArray(material.Locations.VertexPosition);
        game.GL.vertexAttribPointer(material.Locations.VertexPosition, 3, GL_FLOAT, false, 0, 0);

        game.GL.bindBuffer(GL_ARRAY_BUFFER, mesh.NormalBuffer);
        game.GL.enableVertexAttribArray(material.Locations.VertexNormal);
        game.GL.vertexAttribPointer(material.Locations.VertexNormal, 3, GL_FLOAT, false, 0, 0);

        game.GL.bindBuffer(GL_ARRAY_BUFFER, game.GL.createBuffer());
        game.GL.bufferData(GL_ARRAY_BUFFER, offsets, GL_STATIC_DRAW);
        game.GL.enableVertexAttribArray(material.Locations.VertexOffset);
        game.GL.vertexAttribPointer(material.Locations.VertexOffset, 4, GL_FLOAT, false, 0, 0);
        game.GL.vertexAttribDivisor(material.Locations.VertexOffset, 1);

        game.GL.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);

        game.GL.bindVertexArray(null);
        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Instanced,
            Material: material,
            Mesh: mesh,
            FrontFace: GL_CW,
            VAO: vao,
            InstanceCount: offsets.length / 4,
            Palette: palette,
        };
    };
}
