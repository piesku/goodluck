import {Material} from "../../common/material.js";
import {Mesh} from "../../common/mesh.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_STATIC_DRAW} from "../../common/webgl.js";
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
    Kind: RenderKind.Instanced;
    Material: Material<ForwardInstancedLayout>;
    Mesh: Mesh;
    FrontFace: GLenum;
    InstanceOffsets: WebGLBuffer;
    InstanceCount: number;
    Palette: Array<number>;
}

export function render_instanced(mesh: Mesh, offsets: Model, palette: Array<number>) {
    return (game: Game, entity: Entity) => {
        let material = game.MaterialInstanced;

        // We can't extend the mesh's VAO with the VertexOffset attribute
        // because the offsets vary between the instances of the component.

        let instance_offsets = game.Gl.createBuffer()!;
        game.Gl.bindBuffer(GL_ARRAY_BUFFER, instance_offsets);
        game.Gl.bufferData(GL_ARRAY_BUFFER, offsets, GL_STATIC_DRAW);

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Instanced,
            Material: material,
            Mesh: mesh,
            FrontFace: GL_CW,
            InstanceOffsets: instance_offsets,
            InstanceCount: offsets.length / 4,
            Palette: palette,
        };
    };
}
