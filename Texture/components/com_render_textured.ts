import {Material, Mesh} from "../../common/material.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderTextured {
    readonly Kind: RenderKind.Textured;
    readonly Material: Material;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly VAO: WebGLVertexArrayObject;
    Texture: WebGLTexture;
}

let vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export function render_textured(material: Material, mesh: Mesh, texture: WebGLTexture) {
    return (game: Game, entity: Entity) => {
        if (!vaos.has(mesh)) {
            // We only need to create the VAO once.
            let vao = game.GL.createVertexArray()!;
            game.GL.bindVertexArray(vao);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, mesh.VertexBuffer);
            game.GL.enableVertexAttribArray(material.Attributes[TexturedAttribute.Position]);
            game.GL.vertexAttribPointer(
                material.Attributes[TexturedAttribute.Position],
                3,
                GL_FLOAT,
                false,
                0,
                0
            );

            game.GL.bindBuffer(GL_ARRAY_BUFFER, mesh.TexCoordBuffer);
            game.GL.enableVertexAttribArray(material.Attributes[TexturedAttribute.TexCoord]);
            game.GL.vertexAttribPointer(
                material.Attributes[TexturedAttribute.TexCoord],
                2,
                GL_FLOAT,
                false,
                0,
                0
            );

            game.GL.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);

            game.GL.bindVertexArray(null);
            vaos.set(mesh, vao);
        }

        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Textured,
            Material: material,
            Mesh: mesh,
            FrontFace: GL_CW,
            VAO: vaos.get(mesh)!,
            Texture: texture,
        };
    };
}

export const enum TexturedAttribute {
    Position,
    TexCoord,
}

export const enum TexturedUniform {
    PV,
    World,
    Self,
    Sampler,
}
