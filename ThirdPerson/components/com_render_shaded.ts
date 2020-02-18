import {Material, Mesh} from "../../common/material.js";
import {Vec4} from "../../common/math.js";
import {GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderShaded {
    readonly Kind: RenderKind.Shaded;
    readonly Material: Material;
    readonly Mesh: Mesh;
    readonly VAO: WebGLVertexArrayObject;
    Color: Vec4;
}

let vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export function render_shaded(Material: Material, Mesh: Mesh, Color: Vec4) {
    return (game: Game, entity: Entity) => {
        if (!vaos.has(Mesh)) {
            // We only need to create the VAO once.
            let vao = game.GL.createVertexArray()!;
            game.GL.bindVertexArray(vao);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, Mesh.Vertices);
            game.GL.enableVertexAttribArray(ShadedAttribute.Position);
            game.GL.vertexAttribPointer(ShadedAttribute.Position, 3, GL_FLOAT, false, 0, 0);

            game.GL.bindBuffer(GL_ARRAY_BUFFER, Mesh.Normals);
            game.GL.enableVertexAttribArray(ShadedAttribute.Normal);
            game.GL.vertexAttribPointer(ShadedAttribute.Normal, 3, GL_FLOAT, false, 0, 0);

            game.GL.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, Mesh.Indices);

            game.GL.bindVertexArray(null);
            vaos.set(Mesh, vao);
        }

        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = <RenderShaded>{
            Kind: RenderKind.Shaded,
            Material,
            Mesh,
            VAO: vaos.get(Mesh),
            Color,
        };
    };
}

export const enum ShadedAttribute {
    Position = 1,
    Normal = 2,
}

export const enum ShadedUniform {
    PV,
    World,
    Self,
    Color,
    LightCount,
    LightPositions,
    LightDetails,
}
