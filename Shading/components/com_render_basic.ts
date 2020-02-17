import {Material, Mesh} from "../../common/material.js";
import {Vec4} from "../../common/math.js";
import {GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderBasic {
    readonly Kind: RenderKind.Basic;
    readonly Material: Material;
    readonly VAO: WebGLVertexArrayObject;
    readonly Count: number;
    Color: Vec4;
}

let vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export function render_basic(Material: Material, mesh: Mesh, Color: Vec4) {
    return (game: Game, entity: Entity) => {
        if (!vaos.has(mesh)) {
            // We only need to create the VAO once.
            let vao = game.GL.createVertexArray()!;
            game.GL.bindVertexArray(vao);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, mesh.Vertices);
            game.GL.enableVertexAttribArray(BasicAttribute.Position);
            game.GL.vertexAttribPointer(BasicAttribute.Position, 3, GL_FLOAT, false, 0, 0);

            game.GL.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.Indices);

            game.GL.bindVertexArray(null);
            vaos.set(mesh, vao);
        }

        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = <RenderBasic>{
            Kind: RenderKind.Basic,
            Material,
            VAO: vaos.get(mesh),
            Count: mesh.Count,
            Color,
        };
    };
}

export const enum BasicAttribute {
    Position = 1,
}

export const enum BasicUniform {
    PV,
    World,
    Color,
}
