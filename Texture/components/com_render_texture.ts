import {Material, Mesh} from "../../common/material.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderTexture {
    readonly Kind: RenderKind.Texture;
    readonly Material: Material;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly VAO: WebGLVertexArrayObject;
    Texture: WebGLTexture;
}

let vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export function render_texture(Material: Material, Mesh: Mesh, Texture: WebGLTexture) {
    return (game: Game, entity: Entity) => {
        if (!vaos.has(Mesh)) {
            // We only need to create the VAO once.
            let vao = game.GL.createVertexArray()!;
            game.GL.bindVertexArray(vao);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, Mesh.Vertices);
            game.GL.enableVertexAttribArray(TextureAttribute.Position);
            game.GL.vertexAttribPointer(TextureAttribute.Position, 3, GL_FLOAT, false, 0, 0);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, Mesh.Normals);
            game.GL.enableVertexAttribArray(TextureAttribute.Normal);
            game.GL.vertexAttribPointer(TextureAttribute.Normal, 3, GL_FLOAT, false, 0, 0);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, Mesh.TextureCoords);
            game.GL.enableVertexAttribArray(TextureAttribute.TextureCoord);
            game.GL.vertexAttribPointer(TextureAttribute.TextureCoord, 2, GL_FLOAT, false, 0, 0);

            game.GL.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, Mesh.Indices);

            game.GL.bindVertexArray(null);
            vaos.set(Mesh, vao);
        }

        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Texture,
            Material,
            Mesh,
            FrontFace: GL_CW,
            VAO: vaos.get(Mesh)!,
            Texture,
        };
    };
}

export const enum TextureAttribute {
    Position,
    Normal,
    TextureCoord,
}

export const enum TextureUniform {
    PV,
    World,
    Self,
    Sampler,
    LightPositions,
    LightDetails,
}
