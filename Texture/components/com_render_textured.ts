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

export function render_textured(Material: Material, Mesh: Mesh, Texture: WebGLTexture) {
    return (game: Game, entity: Entity) => {
        if (!vaos.has(Mesh)) {
            // We only need to create the VAO once.
            let vao = game.GL.createVertexArray()!;
            game.GL.bindVertexArray(vao);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, Mesh.Vertices);
            game.GL.enableVertexAttribArray(TexturedAttribute.Position);
            game.GL.vertexAttribPointer(TexturedAttribute.Position, 3, GL_FLOAT, false, 0, 0);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, Mesh.TexCoords);
            game.GL.enableVertexAttribArray(TexturedAttribute.TexCoord);
            game.GL.vertexAttribPointer(TexturedAttribute.TexCoord, 2, GL_FLOAT, false, 0, 0);

            game.GL.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, Mesh.Indices);

            game.GL.bindVertexArray(null);
            vaos.set(Mesh, vao);
        }

        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Textured,
            Material,
            Mesh,
            FrontFace: GL_CW,
            VAO: vaos.get(Mesh)!,
            Texture,
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
