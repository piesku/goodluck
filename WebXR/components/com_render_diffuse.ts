import {Material, Mesh} from "../../common/material.js";
import {Vec4} from "../../common/math.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderDiffuse {
    readonly Kind: RenderKind.Diffuse;
    readonly Material: Material;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly VAO: WebGLVertexArrayObject;
    Color: Vec4;
}

let vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export function render_diffuse(
    Material: Material,
    Mesh: Mesh,
    Color: Vec4,
    FrontFace: GLenum = GL_CW
) {
    return (game: Game, entity: Entity) => {
        if (!vaos.has(Mesh)) {
            // We only need to create the VAO once.
            let vao = game.GL.createVertexArray()!;
            game.GL.bindVertexArray(vao);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, Mesh.Vertices);
            game.GL.enableVertexAttribArray(DiffuseAttribute.Position);
            game.GL.vertexAttribPointer(DiffuseAttribute.Position, 3, GL_FLOAT, false, 0, 0);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, Mesh.Normals);
            game.GL.enableVertexAttribArray(DiffuseAttribute.Normal);
            game.GL.vertexAttribPointer(DiffuseAttribute.Normal, 3, GL_FLOAT, false, 0, 0);

            game.GL.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, Mesh.Indices);

            game.GL.bindVertexArray(null);
            vaos.set(Mesh, vao);
        }

        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Diffuse,
            Material,
            Mesh,
            FrontFace,
            VAO: vaos.get(Mesh)!,
            Color,
        };
    };
}

export const enum DiffuseAttribute {
    Position,
    Normal,
}

export const enum DiffuseUniform {
    PV,
    World,
    Self,
    Color,
    LightPositions,
    LightDetails,
}
