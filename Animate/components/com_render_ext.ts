import {Material} from "../../common/material.js";
import {Vec4} from "../../common/math.js";
import {Mesh} from "../../common/mesh.js";
import {
    GL_ARRAY_BUFFER,
    GL_CW,
    GL_ELEMENT_ARRAY_BUFFER,
    GL_FLOAT,
    GL_STATIC_DRAW,
} from "../../common/webgl.js";
import {ColoredShadedLayout} from "../../materials/layout_colored_shaded.js";
import {ForwardShadingLayout} from "../../materials/layout_forward_shading.js";
import {Entity, Game} from "../game.js";
import {SkinningLayout} from "../materials/layout_skinning.js";
import {Has, World} from "../world.js";

export type Render = RenderColoredShaded | RenderColoredSkinned;

export const enum RenderKind {
    ColoredShaded,
    ColoredSkinned,
}

interface Game1 extends Game {
    Gl: WebGLRenderingContext;
    ExtVao: OES_vertex_array_object;
    World: World & {
        Render: Array<Render>;
    };
}

const colored_shaded_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();
const colored_skinned_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export interface RenderColoredShaded {
    readonly Kind: RenderKind.ColoredShaded;
    readonly Material: Material<ColoredShadedLayout & ForwardShadingLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly Vao: WebGLVertexArrayObject;
    DiffuseColor: Vec4;
    SpecularColor: Vec4;
    Shininess: number;
}

export function render_colored_shaded(
    material: Material<ColoredShadedLayout & ForwardShadingLayout>,
    mesh: Mesh,
    diffuse_color: Vec4,
    shininess: number = 0,
    specular_color: Vec4 = [1, 1, 1, 1],
    front_face: GLenum = GL_CW
) {
    return (game: Game1, entity: Entity) => {
        if (!colored_shaded_vaos.has(mesh)) {
            // We only need to create the VAO once.
            let vao = game.ExtVao.createVertexArrayOES()!;
            game.ExtVao.bindVertexArrayOES(vao);

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

            game.ExtVao.bindVertexArrayOES(null);
            colored_shaded_vaos.set(mesh, vao);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ColoredShaded,
            Material: material,
            Mesh: mesh,
            FrontFace: front_face,
            Vao: colored_shaded_vaos.get(mesh)!,
            DiffuseColor: diffuse_color,
            SpecularColor: specular_color,
            Shininess: shininess,
        };
    };
}

export interface RenderColoredSkinned {
    readonly Kind: RenderKind.ColoredSkinned;
    readonly Material: Material<ColoredShadedLayout & ForwardShadingLayout & SkinningLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly Vao: WebGLVertexArrayObject;
    DiffuseColor: Vec4;
    SpecularColor: Vec4;
    Shininess: number;
}

export function render_colored_skinned(
    material: Material<ColoredShadedLayout & ForwardShadingLayout & SkinningLayout>,
    mesh: Mesh,
    diffuse_color: Vec4,
    shininess: number = 0,
    specular_color: Vec4 = [1, 1, 1, 1],
    front_face: GLenum = GL_CW
) {
    return (game: Game1, entity: Entity) => {
        if (!colored_skinned_vaos.has(mesh)) {
            let weights_arr = Float32Array.from([0, 1, 1, 0]);
            let weights_buf = game.Gl.createBuffer()!;
            game.Gl.bindBuffer(GL_ARRAY_BUFFER, weights_buf);
            game.Gl.bufferData(GL_ARRAY_BUFFER, weights_arr, GL_STATIC_DRAW);

            // We only need to create the VAO once.
            let vao = game.ExtVao.createVertexArrayOES()!;
            game.ExtVao.bindVertexArrayOES(vao);

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

            game.Gl.bindBuffer(GL_ARRAY_BUFFER, weights_buf);
            game.Gl.enableVertexAttribArray(material.Locations.VertexWeights);
            game.Gl.vertexAttribPointer(material.Locations.VertexWeights, 1, GL_FLOAT, false, 0, 0);

            game.Gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);

            game.ExtVao.bindVertexArrayOES(null);
            colored_skinned_vaos.set(mesh, vao);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ColoredSkinned,
            Material: material,
            Mesh: mesh,
            FrontFace: front_face,
            Vao: colored_skinned_vaos.get(mesh)!,
            DiffuseColor: diffuse_color,
            SpecularColor: specular_color,
            Shininess: shininess,
        };
    };
}
