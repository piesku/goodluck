import {Material, Mesh} from "../../common/material.js";
import {Vec4} from "../../common/math.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {DeferredColoredLayout} from "../materials/layout_deferred_colored.js";
import {Has} from "../world.js";

export type Render = RenderColored;

export const enum RenderKind {
    DeferredColored,
}

export interface RenderColored {
    readonly Kind: RenderKind.DeferredColored;
    readonly Material: Material<DeferredColoredLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly Vao: WebGLVertexArrayObject;
    Color: Vec4;
}

let colored_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export function render_colored(
    material: Material<DeferredColoredLayout>,
    mesh: Mesh,
    color: Vec4,
    front_face: GLenum = GL_CW
) {
    return (game: Game, entity: Entity) => {
        if (!colored_vaos.has(mesh)) {
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
            colored_vaos.set(mesh, vao);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.DeferredColored,
            Material: material,
            Mesh: mesh,
            FrontFace: front_face,
            Vao: colored_vaos.get(mesh)!,
            Color: color,
        };
    };
}
