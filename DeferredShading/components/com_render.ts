import {Material, Mesh} from "../../common/material.js";
import {Vec3, Vec4} from "../../common/math.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {ColoredDeferredLayout} from "../materials/layout_deferred_colored_shaded.js";
import {Has} from "../world.js";

export type Render = RenderColoredDeferred;

export const enum RenderKind {
    ColoredDeferred,
}

const colored_deferred_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export interface RenderColoredDeferred {
    Kind: RenderKind.ColoredDeferred;
    Material: Material<ColoredDeferredLayout>;
    Mesh: Mesh;
    FrontFace: GLenum;
    Vao: WebGLVertexArrayObject;
    DiffuseColor: Vec4;
    SpecularColor: Vec3;
    Shininess: number;
}

export function render_colored_deferred(
    material: Material<ColoredDeferredLayout>,
    mesh: Mesh,
    diffuse_color: Vec4,
    shininess: number,
    specular_color: Vec3 = [1, 1, 1],
    front_face: GLenum = GL_CW
) {
    return (game: Game, entity: Entity) => {
        if (!colored_deferred_vaos.has(mesh)) {
            // We only need to create the VAO once.
            let vao = game.Gl.createVertexArray()!;
            game.Gl.bindVertexArray(vao);

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

            game.Gl.bindVertexArray(null);
            colored_deferred_vaos.set(mesh, vao);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ColoredDeferred,
            Material: material,
            Mesh: mesh,
            FrontFace: front_face,
            Vao: colored_deferred_vaos.get(mesh)!,
            DiffuseColor: diffuse_color,
            SpecularColor: specular_color,
            Shininess: shininess,
        };
    };
}
