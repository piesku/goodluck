import {Entity, Game} from "../game.js";
import {Material, Shape} from "../materials/mat_common.js";
import {Vec4} from "../math/index.js";
import {GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT, GL_STATIC_DRAW} from "../webgl.js";
import {Get, Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderBasic {
    readonly Kind: RenderKind.Basic;
    readonly Material: Material;
    readonly VAO: WebGLVertexArrayObject;
    readonly Count: number;
    Color: Vec4;
}

let vaos: WeakMap<Shape, WebGLVertexArrayObject> = new WeakMap();

export function render_basic(Material: Material, Shape: Shape, Color: Vec4) {
    return (game: Game, entity: Entity) => {
        if (!vaos.has(Shape)) {
            // We only need to create the VAO once.
            vaos.set(Shape, buffer(game.GL, Shape)!);
        }

        game.World[entity] |= Has.Render;
        game[Get.Render][entity] = <RenderBasic>{
            Kind: RenderKind.Basic,
            Material,
            VAO: vaos.get(Shape),
            Count: Shape.Indices.length,
            Color: Color,
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

function buffer(gl: WebGL2RenderingContext, shape: Shape) {
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(GL_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(GL_ARRAY_BUFFER, shape.Vertices, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(BasicAttribute.Position);
    gl.vertexAttribPointer(BasicAttribute.Position, 3, GL_FLOAT, false, 0, 0);

    gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, shape.Indices, GL_STATIC_DRAW);

    gl.bindVertexArray(null);
    return vao;
}
