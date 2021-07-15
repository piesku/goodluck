/**
 * @module components/com_render
 */

import {Material} from "../../common/material.js";
import {Vec3, Vec4} from "../../common/math.js";
import {Mesh} from "../../common/mesh.js";
import {normalize, subtract} from "../../common/vec3.js";
import {
    GL_ARRAY_BUFFER,
    GL_CW,
    GL_DYNAMIC_DRAW,
    GL_ELEMENT_ARRAY_BUFFER,
    GL_FLOAT,
    GL_STATIC_DRAW,
} from "../../common/webgl.js";
import {Entity} from "../../common/world.js";
import {
    ColoredShadedLayout,
    ColoredUnlitLayout,
    ForwardShadingLayout,
    MappedShadedLayout,
    ShadowMappingLayout,
    TexturedShadedLayout,
    TexturedUnlitLayout,
} from "../../materials/layout.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export type Render =
    | RenderColoredUnlit
    | RenderColoredShaded
    | RenderColoredShadows
    | RenderColoredDeferred
    | RenderTexturedUnlit
    | RenderTexturedShaded
    | RenderMappedShaded
    | RenderVertices;

export const enum RenderKind {
    ColoredUnlit,
    ColoredShaded,
    ColoredShadows,
    ColoredDeferred,
    TexturedUnlit,
    TexturedShaded,
    MappedShaded,
    Vertices,
}

const colored_unlit_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();
const colored_shaded_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();
const colored_shadows_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();
const colored_deferred_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();
const textured_unlit_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();
const textured_shaded_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();
const mapped_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export interface RenderColoredUnlit {
    readonly Kind: RenderKind.ColoredUnlit;
    readonly Material: Material<ColoredUnlitLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly Vao: WebGLVertexArrayObject;
    Color: Vec4;
}

export function render_colored_unlit(
    material: Material<ColoredUnlitLayout>,
    mesh: Mesh,
    color: Vec4
) {
    return (game: Game, entity: Entity) => {
        if (!colored_unlit_vaos.has(mesh)) {
            // We only need to create the VAO once.
            let vao = game.Gl.createVertexArray()!;
            game.Gl.bindVertexArray(vao);

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

            game.Gl.bindVertexArray(null);
            colored_unlit_vaos.set(mesh, vao);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ColoredUnlit,
            Material: material,
            Mesh: mesh,
            FrontFace: GL_CW,
            Vao: colored_unlit_vaos.get(mesh)!,
            Color: color,
        };
    };
}

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
    return (game: Game, entity: Entity) => {
        if (!colored_shaded_vaos.has(mesh)) {
            // We only need to create the VAO once.
            let vao = game.Gl.createVertexArray()!;
            game.Gl.bindVertexArray(vao);

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

            game.Gl.bindVertexArray(null);
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

export interface RenderColoredShadows {
    readonly Kind: RenderKind.ColoredShadows;
    readonly Material: Material<ColoredShadedLayout & ForwardShadingLayout & ShadowMappingLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly Vao: WebGLVertexArrayObject;
    DiffuseColor: Vec4;
    SpecularColor: Vec4;
    Shininess: number;
}

export function render_colored_shadows(
    material: Material<ColoredShadedLayout & ForwardShadingLayout & ShadowMappingLayout>,
    mesh: Mesh,
    diffuse_color: Vec4,
    shininess: number = 0,
    specular_color: Vec4 = [1, 1, 1, 1],
    front_face: GLenum = GL_CW
) {
    return (game: Game, entity: Entity) => {
        if (!colored_shadows_vaos.has(mesh)) {
            // We only need to create the VAO once.
            let vao = game.Gl.createVertexArray()!;
            game.Gl.bindVertexArray(vao);

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

            game.Gl.bindVertexArray(null);
            colored_shadows_vaos.set(mesh, vao);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ColoredShadows,
            Material: material,
            Mesh: mesh,
            FrontFace: front_face,
            Vao: colored_shadows_vaos.get(mesh)!,
            DiffuseColor: diffuse_color,
            SpecularColor: specular_color,
            Shininess: shininess,
        };
    };
}

export interface RenderColoredDeferred {
    Kind: RenderKind.ColoredDeferred;
    Material: Material<ColoredShadedLayout>;
    Mesh: Mesh;
    FrontFace: GLenum;
    Vao: WebGLVertexArrayObject;
    DiffuseColor: Vec4;
    SpecularColor: Vec3;
    Shininess: number;
}

export function render_colored_deferred(
    material: Material<ColoredShadedLayout>,
    mesh: Mesh,
    diffuse_color: Vec4,
    shininess: number = 0,
    specular_color: Vec3 = [1, 1, 1],
    front_face: GLenum = GL_CW
) {
    return (game: Game, entity: Entity) => {
        if (!colored_deferred_vaos.has(mesh)) {
            // We only need to create the VAO once.
            let vao = game.Gl.createVertexArray()!;
            game.Gl.bindVertexArray(vao);

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

            game.Gl.bindVertexArray(null);
            colored_deferred_vaos.set(mesh, vao);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ColoredDeferred,
            Material: material,
            Mesh: mesh,
            FrontFace: front_face,
            Vao: colored_deferred_vaos.get(mesh)!,
            DiffuseColor: diffuse_color,
            SpecularColor: specular_color,
            Shininess: shininess,
        };
    };
}

export interface RenderTexturedUnlit {
    readonly Kind: RenderKind.TexturedUnlit;
    readonly Material: Material<TexturedUnlitLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly Vao: WebGLVertexArrayObject;
    Texture: WebGLTexture;
    Color: Vec4;
}

export function render_textured_unlit(
    material: Material<TexturedUnlitLayout>,
    mesh: Mesh,
    texture: WebGLTexture,
    color: Vec4 = [1, 1, 1, 1]
) {
    return (game: Game, entity: Entity) => {
        if (!textured_unlit_vaos.has(mesh)) {
            // We only need to create the VAO once.
            let vao = game.Gl.createVertexArray()!;
            game.Gl.bindVertexArray(vao);

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

            game.Gl.bindBuffer(GL_ARRAY_BUFFER, mesh.TexCoordBuffer);
            game.Gl.enableVertexAttribArray(material.Locations.VertexTexCoord);
            game.Gl.vertexAttribPointer(
                material.Locations.VertexTexCoord,
                2,
                GL_FLOAT,
                false,
                0,
                0
            );

            game.Gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);

            game.Gl.bindVertexArray(null);
            textured_unlit_vaos.set(mesh, vao);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.TexturedUnlit,
            Material: material,
            Mesh: mesh,
            FrontFace: GL_CW,
            Vao: textured_unlit_vaos.get(mesh)!,
            Texture: texture,
            Color: color,
        };
    };
}

export interface RenderTexturedShaded {
    readonly Kind: RenderKind.TexturedShaded;
    readonly Material: Material<TexturedShadedLayout & ForwardShadingLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly Vao: WebGLVertexArrayObject;
    Texture: WebGLTexture;
    DiffuseColor: Vec4;
    SpecularColor: Vec4;
    Shininess: number;
}

export function render_textured_shaded(
    material: Material<TexturedShadedLayout & ForwardShadingLayout>,
    mesh: Mesh,
    texture: WebGLTexture,
    shininess: number = 0,
    diffuse_color: Vec4 = [1, 1, 1, 1],
    specular_color: Vec4 = [1, 1, 1, 1],
    front_face: GLenum = GL_CW
) {
    return (game: Game, entity: Entity) => {
        if (!textured_shaded_vaos.has(mesh)) {
            // We only need to create the VAO once.
            let vao = game.Gl.createVertexArray()!;
            game.Gl.bindVertexArray(vao);

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

            game.Gl.bindBuffer(GL_ARRAY_BUFFER, mesh.TexCoordBuffer);
            game.Gl.enableVertexAttribArray(material.Locations.VertexTexCoord);
            game.Gl.vertexAttribPointer(
                material.Locations.VertexTexCoord,
                2,
                GL_FLOAT,
                false,
                0,
                0
            );

            game.Gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);

            game.Gl.bindVertexArray(null);
            textured_shaded_vaos.set(mesh, vao);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.TexturedShaded,
            Material: material,
            Mesh: mesh,
            FrontFace: front_face,
            Vao: textured_shaded_vaos.get(mesh)!,
            Texture: texture,
            DiffuseColor: diffuse_color,
            SpecularColor: specular_color,
            Shininess: shininess,
        };
    };
}

export interface RenderMappedShaded {
    readonly Kind: RenderKind.MappedShaded;
    readonly Material: Material<MappedShadedLayout & ForwardShadingLayout>;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    readonly Vao: WebGLVertexArrayObject;
    DiffuseMap: WebGLTexture;
    DiffuseColor: Vec4;
    NormalMap: WebGLTexture;
    RoughnessMap: WebGLTexture;
}

export function render_mapped_shaded(
    material: Material<MappedShadedLayout & ForwardShadingLayout>,
    mesh: Mesh,
    diffuse_map: WebGLTexture,
    normal_map: WebGLTexture,
    roughness_map: WebGLTexture,
    diffuse_color: Vec4 = [1, 1, 1, 1]
) {
    return (game: Game, entity: Entity) => {
        if (!mapped_vaos.has(mesh)) {
            // We only need to create the VAO once.
            let vao = game.Gl.createVertexArray()!;
            game.Gl.bindVertexArray(vao);

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

            game.Gl.bindBuffer(GL_ARRAY_BUFFER, mesh.TexCoordBuffer);
            game.Gl.enableVertexAttribArray(material.Locations.VertexTexCoord);
            game.Gl.vertexAttribPointer(
                material.Locations.VertexTexCoord,
                2,
                GL_FLOAT,
                false,
                0,
                0
            );

            game.Gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);

            let tangent_arr = new Float32Array(mesh.NormalArray.length);
            let bitangent_arr = new Float32Array(mesh.NormalArray.length);

            for (let i = 0; i < mesh.IndexCount; i += 3) {
                let v0 = mesh.IndexArray[i + 0];
                let v1 = mesh.IndexArray[i + 1];
                let v2 = mesh.IndexArray[i + 2];

                let p0: Vec3 = [
                    mesh.VertexArray[v0 * 3 + 0],
                    mesh.VertexArray[v0 * 3 + 1],
                    mesh.VertexArray[v0 * 3 + 2],
                ];
                let p1: Vec3 = [
                    mesh.VertexArray[v1 * 3 + 0],
                    mesh.VertexArray[v1 * 3 + 1],
                    mesh.VertexArray[v1 * 3 + 2],
                ];
                let p2: Vec3 = [
                    mesh.VertexArray[v2 * 3 + 0],
                    mesh.VertexArray[v2 * 3 + 1],
                    mesh.VertexArray[v2 * 3 + 2],
                ];

                let edge1 = subtract([0, 0, 0], p1, p0);
                let edge2 = subtract([0, 0, 0], p2, p0);

                let delta_u1 = mesh.TexCoordArray[v1 * 2 + 0] - mesh.TexCoordArray[v0 * 2 + 0];
                let delta_v1 = mesh.TexCoordArray[v1 * 2 + 1] - mesh.TexCoordArray[v0 * 2 + 1];
                let delta_u2 = mesh.TexCoordArray[v2 * 2 + 0] - mesh.TexCoordArray[v0 * 2 + 0];
                let delta_v2 = mesh.TexCoordArray[v2 * 2 + 1] - mesh.TexCoordArray[v0 * 2 + 1];

                let r = 1 / (delta_u1 * delta_v2 - delta_u2 * delta_v1);
                let tangent: Vec3 = [
                    r * (delta_v2 * edge1[0] - delta_v1 * edge2[0]),
                    r * (delta_v2 * edge1[1] - delta_v1 * edge2[1]),
                    r * (delta_v2 * edge1[2] - delta_v1 * edge2[2]),
                ];
                let bitangent: Vec3 = [
                    r * (-delta_u2 * edge1[0] + delta_u1 * edge2[0]),
                    r * (-delta_u2 * edge1[1] + delta_u1 * edge2[1]),
                    r * (-delta_u2 * edge1[2] + delta_u1 * edge2[2]),
                ];

                normalize(tangent, tangent);
                tangent_arr.set(tangent, v0 * 2);
                tangent_arr.set(tangent, v1 * 2);
                tangent_arr.set(tangent, v2 * 2);

                normalize(bitangent, bitangent);
                bitangent_arr.set(bitangent, v0 * 2);
                bitangent_arr.set(bitangent, v1 * 2);
                bitangent_arr.set(bitangent, v2 * 2);
            }

            let tangent_buf = game.Gl.createBuffer()!;
            game.Gl.bindBuffer(GL_ARRAY_BUFFER, tangent_buf);
            game.Gl.bufferData(GL_ARRAY_BUFFER, tangent_arr, GL_STATIC_DRAW);
            game.Gl.enableVertexAttribArray(material.Locations.VertexTangent);
            game.Gl.vertexAttribPointer(material.Locations.VertexTangent, 3, GL_FLOAT, false, 0, 0);

            let bitangent_buf = game.Gl.createBuffer()!;
            game.Gl.bindBuffer(GL_ARRAY_BUFFER, bitangent_buf);
            game.Gl.bufferData(GL_ARRAY_BUFFER, bitangent_arr, GL_STATIC_DRAW);
            game.Gl.enableVertexAttribArray(material.Locations.VertexBitangent);
            game.Gl.vertexAttribPointer(
                material.Locations.VertexBitangent,
                3,
                GL_FLOAT,
                false,
                0,
                0
            );

            game.Gl.bindVertexArray(null);
            mapped_vaos.set(mesh, vao);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.MappedShaded,
            Material: material,
            Mesh: mesh,
            FrontFace: GL_CW,
            Vao: mapped_vaos.get(mesh)!,
            DiffuseMap: diffuse_map,
            DiffuseColor: diffuse_color,
            NormalMap: normal_map,
            RoughnessMap: roughness_map,
        };
    };
}

export interface RenderVertices {
    Kind: RenderKind.Vertices;
    Material: Material<ColoredUnlitLayout>;
    FrontFace: GLenum;
    VertexBuffer: WebGLBuffer;
    IndexCount: number;
    Color: Vec4;
}

export function render_vertices(material: Material<ColoredUnlitLayout>, max: number, color: Vec4) {
    return (game: Game, entity: Entity) => {
        let vertex_buf = game.Gl.createBuffer()!;
        game.Gl.bindBuffer(GL_ARRAY_BUFFER, vertex_buf);
        game.Gl.bufferData(GL_ARRAY_BUFFER, max * Float32Array.BYTES_PER_ELEMENT, GL_DYNAMIC_DRAW);

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Vertices,
            Material: material,
            FrontFace: GL_CW,
            VertexBuffer: vertex_buf,
            IndexCount: 0,
            Color: color,
        };
    };
}
