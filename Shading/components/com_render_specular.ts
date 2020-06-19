import {Material, Mesh} from "../../common/material.js";
import {Vec4} from "../../common/math.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT} from "../../common/webgl.js";
import {SpecularLayout} from "../../materials/layout_specular.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";
import {RenderKind} from "./com_render.js";

export interface RenderSpecular {
    readonly Kind: RenderKind.Specular;
    readonly Material: Material<SpecularLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly Vao: WebGLVertexArrayObject;
    ColorDiffuse: Vec4;
    ColorSpecular: Vec4;
    Shininess: number;
}

let vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export function render_specular(
    material: Material<SpecularLayout>,
    mesh: Mesh,
    color_diffuse: Vec4,
    shininess: number = 1,
    color_specular: Vec4 = color_diffuse
) {
    return (game: Game, entity: Entity) => {
        if (!vaos.has(mesh)) {
            // We only need to create the VAO once.
            let vao = game.ExtVao.createVertexArrayOES()!;
            game.ExtVao.bindVertexArrayOES(vao);

            game.Gl.bindBuffer(GL_ARRAY_BUFFER, mesh.VertexBuffer);
            game.Gl.enableVertexAttribArray(material.Locations.VertexPosition);
            game.Gl.vertexAttribPointer(
                material.Locations.VertexPosition,
                3,
                GL_FLOAT,
                false,
                0,
                0
            );

            game.Gl.bindBuffer(GL_ARRAY_BUFFER, mesh.NormalBuffer);
            game.Gl.enableVertexAttribArray(material.Locations.VertexNormal);
            game.Gl.vertexAttribPointer(material.Locations.VertexNormal, 3, GL_FLOAT, false, 0, 0);

            game.Gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);

            game.ExtVao.bindVertexArrayOES(null);
            vaos.set(mesh, vao);
        }

        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Specular,
            Material: material,
            Mesh: mesh,
            FrontFace: GL_CW,
            Vao: vaos.get(mesh)!,
            ColorDiffuse: color_diffuse,
            ColorSpecular: color_specular,
            Shininess: shininess,
        };
    };
}
