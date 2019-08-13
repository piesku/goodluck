import {Entity, Game} from "../game.js";
import {Material, Shape} from "../materials/mat_common.js";
import {Vec4} from "../math/index.js";
import {Get} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderBasic {
    readonly kind: RenderKind.Basic;
    readonly material: Material;
    readonly vao: WebGLVertexArrayObject;
    readonly count: number;
    color: Vec4;
}

let vaos: WeakMap<Shape, WebGLVertexArrayObject> = new WeakMap();

export function render_basic(material: Material, shape: Shape, color: Vec4) {
    return (game: Game) => (entity: Entity) => {
        if (!vaos.has(shape)) {
            // We only need to create the VAO once.
            vaos.set(shape, buffer(game.gl, shape)!);
        }

        game.world[entity] |= 1 << Get.Render;
        game[Get.Render][entity] = <RenderBasic>{
            kind: RenderKind.Basic,
            material,
            vao: vaos.get(shape),
            count: shape.indices.length,
            color,
        };
    };
}

export const enum BasicAttribute {
    position = 1,
}

function buffer(gl: WebGL2RenderingContext, shape: Shape) {
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, shape.vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(BasicAttribute.position);
    gl.vertexAttribPointer(BasicAttribute.position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, shape.indices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    return vao;
}
