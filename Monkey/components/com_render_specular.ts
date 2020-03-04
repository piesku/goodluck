import {Material, Mesh} from "../../common/material.js";
import {Vec4} from "../../common/math.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderSpecular {
    readonly Kind: RenderKind.Specular;
    readonly Material: Material;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly VAO: WebGLVertexArrayObject;
    ColorDiffuse: Vec4;
    ColorSpecular: Vec4;
    Shininess: number;
}

let vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export function render_specular(
    material: Material,
    mesh: Mesh,
    color_diffuse: Vec4,
    shininess: number = 1,
    color_specular: Vec4 = color_diffuse
) {
    return (game: Game, entity: Entity) => {
        if (!vaos.has(mesh)) {
            // We only need to create the VAO once.
            let vao = game.GL.createVertexArray()!;
            game.GL.bindVertexArray(vao);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, mesh.Vertices);
            game.GL.enableVertexAttribArray(SpecularAttribute.Position);
            game.GL.vertexAttribPointer(SpecularAttribute.Position, 3, GL_FLOAT, false, 0, 0);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, mesh.Normals);
            game.GL.enableVertexAttribArray(SpecularAttribute.Normal);
            game.GL.vertexAttribPointer(SpecularAttribute.Normal, 3, GL_FLOAT, false, 0, 0);

            game.GL.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.Indices);

            game.GL.bindVertexArray(null);
            vaos.set(mesh, vao);
        }

        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Specular,
            Material: material,
            Mesh: mesh,
            FrontFace: GL_CW,
            VAO: vaos.get(mesh)!,
            ColorDiffuse: color_diffuse,
            ColorSpecular: color_specular,
            Shininess: shininess,
        };
    };
}

export const enum SpecularAttribute {
    Position = 1,
    Normal = 2,
}

export const enum SpecularUniform {
    PV,
    World,
    Self,
    Eye,
    ColorDiffuse,
    ColorSpecular,
    Shininess,
    LightCount,
    LightPositions,
    LightDetails,
}
