import {Material} from "../../common/material.js";
import {Vec4} from "../../common/math.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_DYNAMIC_DRAW} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderPath {
    Kind: RenderKind.Path;
    Material: Material;
    FrontFace: GLenum;
    VertexBuffer: WebGLBuffer;
    IndexCount: number;
    Color: Vec4;
}

/**
 * render_path can use Basic materials.
 */
export function render_path(max: number, color: Vec4) {
    return (game: Game, entity: Entity) => {
        let vertex_buf = game.GL.createBuffer()!;
        game.GL.bindBuffer(GL_ARRAY_BUFFER, vertex_buf);
        game.GL.bufferData(GL_ARRAY_BUFFER, max * Float32Array.BYTES_PER_ELEMENT, GL_DYNAMIC_DRAW);

        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Path,
            Material: game.MaterialBasicLine,
            FrontFace: GL_CW,
            VertexBuffer: vertex_buf,
            IndexCount: 0,
            Color: color,
        };
    };
}
