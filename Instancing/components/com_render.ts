import {Material} from "../../common/material.js";
import {Mesh} from "../../common/mesh.js";
import {
    GL_ARRAY_BUFFER,
    GL_CW,
    GL_ELEMENT_ARRAY_BUFFER,
    GL_FLOAT,
    GL_STATIC_DRAW,
} from "../../common/webgl.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {ForwardInstancedLayout} from "../materials/layout_instancing.js";
import {Model} from "../model.js";
import {Has} from "../world.js";

export type Render = RenderInstanced;

export const enum RenderKind {
    Instanced,
}

export interface RenderInstanced {
    readonly Kind: RenderKind.Instanced;
    readonly Material: Material<ForwardInstancedLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly Vao: WebGLVertexArrayObject;
    readonly InstanceCount: number;
    readonly Palette: Array<number>;
}

export function render_instanced(mesh: Mesh, offsets: Model, palette: Array<number>) {
    return (game: Game, entity: Entity) => {
        let material = game.MaterialInstanced;

        // We can't cache the VAO per mesh, like we do in com_render in other
        // examples, because the offsets vary between the instances of the
        // component. Hint: If offset models are guaranteed to only ever be
        // rendered using the same mesh as atoms (e.g. a model of a horse is
        // always rendered using cube voxels), it might be beneficial to cache
        // VAOs per model.
        let vao = game.Gl.createVertexArray()!;
        game.Gl.bindVertexArray(vao);

        game.Gl.bindBuffer(GL_ARRAY_BUFFER, mesh.VertexBuffer);
        game.Gl.enableVertexAttribArray(material.Locations.VertexPosition);
        game.Gl.vertexAttribPointer(material.Locations.VertexPosition, 3, GL_FLOAT, false, 0, 0);

        game.Gl.bindBuffer(GL_ARRAY_BUFFER, mesh.NormalBuffer);
        game.Gl.enableVertexAttribArray(material.Locations.VertexNormal);
        game.Gl.vertexAttribPointer(material.Locations.VertexNormal, 3, GL_FLOAT, false, 0, 0);

        game.Gl.bindBuffer(GL_ARRAY_BUFFER, game.Gl.createBuffer());
        game.Gl.bufferData(GL_ARRAY_BUFFER, offsets, GL_STATIC_DRAW);
        game.Gl.enableVertexAttribArray(material.Locations.VertexOffset);
        game.Gl.vertexAttribPointer(material.Locations.VertexOffset, 4, GL_FLOAT, false, 0, 0);
        game.Gl.vertexAttribDivisor(material.Locations.VertexOffset, 1);

        game.Gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);

        game.Gl.bindVertexArray(null);
        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Instanced,
            Material: material,
            Mesh: mesh,
            FrontFace: GL_CW,
            Vao: vao,
            InstanceCount: offsets.length / 4,
            Palette: palette,
        };
    };
}
