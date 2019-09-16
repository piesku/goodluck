import {Entity, Game} from "../game.js";
import {Material, Shape} from "../materials/mat_common.js";
import {Vec4} from "../math/index.js";
import {Get} from "./com_index.js";
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
    return (game: Game) => (entity: Entity) => {
        if (!vaos.has(Shape)) {
            // We only need to create the VAO once.
            vaos.set(Shape, buffer(game.gl, Shape)!);
        }

        game.world[entity] |= 1 << Get.Render;
        game[Get.Render][entity] = <RenderBasic>{
            Kind: RenderKind.Basic,
            Material,
            VAO: vaos.get(Shape),
            Count: Shape.indices.length,
            Color: Color,
        };
    };
}

export const enum BasicAttribute {
    Position = 1,
}

function buffer(gl: WebGL2RenderingContext, shape: Shape) {
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, shape.vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(BasicAttribute.Position);
    gl.vertexAttribPointer(BasicAttribute.Position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, shape.indices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    return vao;
}
