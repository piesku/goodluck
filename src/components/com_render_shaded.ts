import {Entity, Game} from "../game.js";
import {Material, Shape} from "../materials/mat_common.js";
import {Vec4} from "../math/index.js";
import {GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT, GL_STATIC_DRAW} from "../webgl.js";
import {Get, Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderShaded {
    readonly Kind: RenderKind.Shaded;
    readonly Material: Material;
    readonly VAO: WebGLVertexArrayObject;
    readonly Count: number;
    Color: Vec4;
}

let vaos: WeakMap<Shape, WebGLVertexArrayObject> = new WeakMap();

export function render_shaded(Material: Material, shape: Shape, color: Vec4) {
    return (game: Game, entity: Entity) => {
        if (!vaos.has(shape)) {
            // We only need to create the VAO once.
            vaos.set(shape, buffer(game.GL, shape)!);
        }

        game.World[entity] |= Has.Render;
        game[Get.Render][entity] = <RenderShaded>{
            Kind: RenderKind.Shaded,
            Material,
            VAO: vaos.get(shape),
            Count: shape.Indices.length,
            Color: color,
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

function buffer(gl: WebGL2RenderingContext, shape: Shape) {
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(GL_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(GL_ARRAY_BUFFER, shape.Vertices, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(ShadedAttribute.Position);
    gl.vertexAttribPointer(ShadedAttribute.Position, 3, GL_FLOAT, false, 0, 0);

    gl.bindBuffer(GL_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(GL_ARRAY_BUFFER, shape.Normals, GL_STATIC_DRAW);
    gl.enableVertexAttribArray(ShadedAttribute.Normal);
    gl.vertexAttribPointer(ShadedAttribute.Normal, 3, GL_FLOAT, false, 0, 0);

    gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, shape.Indices, GL_STATIC_DRAW);

    gl.bindVertexArray(null);
    return vao;
}
