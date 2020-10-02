import {Material, Mesh} from "../../common/material.js";
import {Vec4} from "../../common/math.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT} from "../../common/webgl.js";
import {BasicLayout} from "../../materials/layout_basic.js";
import {DiffuseLayout} from "../../materials/layout_diffuse.js";
import {SpecularLayout} from "../../materials/layout_specular.js";
import {Entity, Game} from "../game.js";
import {Has, World} from "../world.js";

export type Render = RenderBasic | RenderDiffuse | RenderSpecular;

export const enum RenderKind {
    Basic,
    Diffuse,
    Specular,
}

interface Game1 extends Game {
    Gl: WebGLRenderingContext;
    ExtVao: OES_vertex_array_object;
    World: World & {
        Render: Array<Render>;
    };
}

export interface RenderBasic {
    readonly Kind: RenderKind.Basic;
    readonly Material: Material<BasicLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly Vao: WebGLVertexArrayObject;
    Color: Vec4;
}

let render_basic_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export function render_basic(material: Material<BasicLayout>, mesh: Mesh, color: Vec4) {
    return (game: Game1, entity: Entity) => {
        if (!render_basic_vaos.has(mesh)) {
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

            game.Gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);

            game.ExtVao.bindVertexArrayOES(null);
            render_basic_vaos.set(mesh, vao);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Basic,
            Material: material,
            Mesh: mesh,
            FrontFace: GL_CW,
            Vao: render_basic_vaos.get(mesh)!,
            Color: color,
        };
    };
}

export interface RenderDiffuse {
    readonly Kind: RenderKind.Diffuse;
    readonly Material: Material<DiffuseLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly Vao: WebGLVertexArrayObject;
    Color: Vec4;
}

let render_diffuse_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export function render_diffuse(material: Material<DiffuseLayout>, mesh: Mesh, color: Vec4) {
    return (game: Game1, entity: Entity) => {
        if (!render_diffuse_vaos.has(mesh)) {
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
            render_diffuse_vaos.set(mesh, vao);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Diffuse,
            Material: material,
            Mesh: mesh,
            FrontFace: GL_CW,
            Vao: render_diffuse_vaos.get(mesh)!,
            Color: color,
        };
    };
}

export interface RenderSpecular {
    readonly Kind: RenderKind.Specular;
    readonly Material: Material<SpecularLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly Vao: WebGLVertexArrayObject;
    ColorDiffuse: Vec4;
    ColorSpecular: Vec4;
    Shininess: number;
}

let render_specular_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export function render_specular(
    material: Material<SpecularLayout>,
    mesh: Mesh,
    color_diffuse: Vec4,
    shininess: number = 1,
    color_specular: Vec4 = color_diffuse
) {
    return (game: Game1, entity: Entity) => {
        if (!render_specular_vaos.has(mesh)) {
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
            render_specular_vaos.set(mesh, vao);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Specular,
            Material: material,
            Mesh: mesh,
            FrontFace: GL_CW,
            Vao: render_specular_vaos.get(mesh)!,
            ColorDiffuse: color_diffuse,
            ColorSpecular: color_specular,
            Shininess: shininess,
        };
    };
}
