import {Material} from "../../common/material.js";
import {Vec4} from "../../common/math.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_STATIC_DRAW} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderPath {
    Kind: RenderKind.Path;
    Material: Material;
    FrontFace: GLenum;
    VertexBuffer: WebGLBuffer;
    VertexArray: Float32Array;
    Color: Vec4;
}

/**
 * render_path can use Basic materials.
 */
export function render_path(material: Material, vertices: Array<number>, color: Vec4) {
    return (game: Game, entity: Entity) => {
        let vertex_arr = Float32Array.from(vertices);
        let vertex_buf = game.GL.createBuffer()!;
        game.GL.bindBuffer(GL_ARRAY_BUFFER, vertex_buf);
        game.GL.bufferData(GL_ARRAY_BUFFER, vertex_arr, GL_STATIC_DRAW);

        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Path,
            Material: material,
            FrontFace: GL_CW,
            VertexBuffer: vertex_buf,
            VertexArray: vertex_arr,
            Color: color,
        };
    };
}
