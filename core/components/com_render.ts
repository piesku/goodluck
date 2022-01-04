/**
 * @module components/com_render
 */

import {Material} from "../../common/material.js";
import {Vec2, Vec3, Vec4} from "../../common/math.js";
import {Mesh} from "../../common/mesh.js";
import {normalize, subtract} from "../../common/vec3.js";
import {
    GL_ARRAY_BUFFER,
    GL_CW,
    GL_DYNAMIC_DRAW,
    GL_FLOAT,
    GL_STATIC_DRAW,
} from "../../common/webgl.js";
import {Entity} from "../../common/world.js";
import {
    Attribute,
    ColoredDeferredLayout,
    ColoredShadedLayout,
    ColoredUnlitLayout,
    ForwardShadingLayout,
    MappedShadedLayout,
    ParticlesColoredLayout,
    ParticlesTexturedLayout,
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
    | RenderVertices
    | RenderParticlesColored
    | RenderParticlesTextured;

export const enum RenderKind {
    ColoredUnlit,
    ColoredShaded,
    ColoredShadows,
    ColoredDeferred,
    TexturedUnlit,
    TexturedShaded,
    MappedShaded,
    Vertices,
    ParticlesColored,
    ParticlesTextured,
}

export const enum RenderPhase {
    Opaque,
    Transparent,
}

export interface RenderColoredUnlit {
    readonly Kind: RenderKind.ColoredUnlit;
    Material: Material<ColoredUnlitLayout>;
    Mesh: Mesh;
    Phase: RenderPhase;
    FrontFace: GLenum;
    Color: Vec4;
}

export function render_colored_unlit(
    material: Material<ColoredUnlitLayout>,
    mesh: Mesh,
    color: Vec4
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ColoredUnlit,
            Material: material,
            Mesh: mesh,
            Phase: color[3] < 1 ? RenderPhase.Transparent : RenderPhase.Opaque,
            FrontFace: GL_CW,
            Color: color,
        };
    };
}

export interface RenderColoredShaded {
    readonly Kind: RenderKind.ColoredShaded;
    Material: Material<ColoredShadedLayout & ForwardShadingLayout>;
    Mesh: Mesh;
    Phase: RenderPhase;
    FrontFace: GLenum;
    DiffuseColor: Vec4;
    SpecularColor: Vec4;
    EmissiveColor: Vec4;
}

export function render_colored_shaded(
    material: Material<ColoredShadedLayout & ForwardShadingLayout>,
    mesh: Mesh,
    diffuse_color: Vec4,
    shininess: number = 0,
    emission: number = 0,
    specular_rgb: Vec3 = [1, 1, 1],
    front_face: GLenum = GL_CW
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ColoredShaded,
            Material: material,
            Mesh: mesh,
            Phase: diffuse_color[3] < 1 ? RenderPhase.Transparent : RenderPhase.Opaque,
            FrontFace: front_face,
            DiffuseColor: diffuse_color,
            SpecularColor: [...specular_rgb, shininess],
            EmissiveColor: [diffuse_color[0], diffuse_color[1], diffuse_color[2], emission],
        };
    };
}

export interface RenderColoredShadows {
    readonly Kind: RenderKind.ColoredShadows;
    Material: Material<ColoredShadedLayout & ForwardShadingLayout & ShadowMappingLayout>;
    Mesh: Mesh;
    Phase: RenderPhase;
    FrontFace: GLenum;
    DiffuseColor: Vec4;
    SpecularColor: Vec4;
    EmissiveColor: Vec4;
}

export function render_colored_shadows(
    material: Material<ColoredShadedLayout & ForwardShadingLayout & ShadowMappingLayout>,
    mesh: Mesh,
    diffuse_color: Vec4,
    shininess: number = 0,
    emission: number = 0,
    specular_rgb: Vec3 = [1, 1, 1],
    front_face: GLenum = GL_CW
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ColoredShadows,
            Material: material,
            Mesh: mesh,
            Phase: diffuse_color[3] < 1 ? RenderPhase.Transparent : RenderPhase.Opaque,
            FrontFace: front_face,
            DiffuseColor: diffuse_color,
            SpecularColor: [...specular_rgb, shininess],
            EmissiveColor: [diffuse_color[0], diffuse_color[1], diffuse_color[2], emission],
        };
    };
}

export interface RenderColoredDeferred {
    readonly Kind: RenderKind.ColoredDeferred;
    Material: Material<ColoredDeferredLayout>;
    Mesh: Mesh;
    Phase: RenderPhase.Opaque;
    FrontFace: GLenum;
    DiffuseColor: Vec3;
    SpecularColor: Vec4;
    Emission: number;
}

export function render_colored_deferred(
    material: Material<ColoredDeferredLayout>,
    mesh: Mesh,
    diffuse_color: Vec3,
    shininess: number = 0,
    emission: number = 0,
    specular_rgb: Vec3 = [1, 1, 1],
    front_face: GLenum = GL_CW
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ColoredDeferred,
            Material: material,
            Mesh: mesh,
            Phase: RenderPhase.Opaque,
            FrontFace: front_face,
            DiffuseColor: diffuse_color,
            SpecularColor: [...specular_rgb, shininess],
            Emission: emission,
        };
    };
}

export interface RenderTexturedUnlit {
    readonly Kind: RenderKind.TexturedUnlit;
    Material: Material<TexturedUnlitLayout>;
    Mesh: Mesh;
    Phase: RenderPhase;
    FrontFace: GLenum;
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
        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.TexturedUnlit,
            Material: material,
            Mesh: mesh,
            Phase: color[3] < 1 ? RenderPhase.Transparent : RenderPhase.Opaque,
            FrontFace: GL_CW,
            Texture: texture,
            Color: color,
        };
    };
}

export interface RenderTexturedShaded {
    readonly Kind: RenderKind.TexturedShaded;
    Material: Material<TexturedShadedLayout & ForwardShadingLayout>;
    Mesh: Mesh;
    Phase: RenderPhase;
    FrontFace: GLenum;
    Texture: WebGLTexture;
    DiffuseColor: Vec4;
    SpecularColor: Vec4;
    EmissiveColor: Vec4;
}

export function render_textured_shaded(
    material: Material<TexturedShadedLayout & ForwardShadingLayout>,
    mesh: Mesh,
    texture: WebGLTexture,
    shininess: number = 0,
    emission: number = 0,
    diffuse_color: Vec4 = [1, 1, 1, 1],
    specular_rgb: Vec3 = [1, 1, 1],
    front_face: GLenum = GL_CW
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.TexturedShaded,
            Material: material,
            Mesh: mesh,
            Phase: diffuse_color[3] < 1 ? RenderPhase.Transparent : RenderPhase.Opaque,
            FrontFace: front_face,
            Texture: texture,
            DiffuseColor: diffuse_color,
            SpecularColor: [...specular_rgb, shininess],
            EmissiveColor: [diffuse_color[0], diffuse_color[1], diffuse_color[2], emission],
        };
    };
}

export interface RenderMappedShaded {
    readonly Kind: RenderKind.MappedShaded;
    Material: Material<MappedShadedLayout & ForwardShadingLayout>;
    Mesh: Mesh;
    Phase: RenderPhase;
    FrontFace: GLenum;
    DiffuseMap: WebGLTexture;
    DiffuseColor: Vec4;
    NormalMap: WebGLTexture;
    RoughnessMap: WebGLTexture;
}

const mapped_meshes: WeakSet<Mesh> = new WeakSet();
export function render_mapped_shaded(
    material: Material<MappedShadedLayout & ForwardShadingLayout>,
    mesh: Mesh,
    diffuse_map: WebGLTexture,
    normal_map: WebGLTexture,
    roughness_map: WebGLTexture,
    diffuse_color: Vec4 = [1, 1, 1, 1]
) {
    return (game: Game, entity: Entity) => {
        if (!mapped_meshes.has(mesh)) {
            // Extend the VAO with tangent and bitangent attributes.
            mapped_meshes.add(mesh);
            game.Gl.bindVertexArray(mesh.Vao);

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
            game.Gl.enableVertexAttribArray(Attribute.Tangent);
            game.Gl.vertexAttribPointer(Attribute.Tangent, 3, GL_FLOAT, false, 0, 0);

            let bitangent_buf = game.Gl.createBuffer()!;
            game.Gl.bindBuffer(GL_ARRAY_BUFFER, bitangent_buf);
            game.Gl.bufferData(GL_ARRAY_BUFFER, bitangent_arr, GL_STATIC_DRAW);
            game.Gl.enableVertexAttribArray(Attribute.Bitangent);
            game.Gl.vertexAttribPointer(Attribute.Bitangent, 3, GL_FLOAT, false, 0, 0);

            game.Gl.bindVertexArray(null);
        }

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.MappedShaded,
            Material: material,
            Mesh: mesh,
            Phase: diffuse_color[3] < 1 ? RenderPhase.Transparent : RenderPhase.Opaque,
            FrontFace: GL_CW,
            DiffuseMap: diffuse_map,
            DiffuseColor: diffuse_color,
            NormalMap: normal_map,
            RoughnessMap: roughness_map,
        };
    };
}

export interface RenderVertices {
    readonly Kind: RenderKind.Vertices;
    Material: Material<ColoredUnlitLayout>;
    Phase: RenderPhase;
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
            Phase: color[3] < 1 ? RenderPhase.Transparent : RenderPhase.Opaque,
            FrontFace: GL_CW,
            VertexBuffer: vertex_buf,
            IndexCount: 0,
            Color: color,
        };
    };
}

export const FLOATS_PER_PARTICLE = 8;
export const MAX_PARTICLES = 200;

export interface RenderParticlesColored {
    Kind: RenderKind.ParticlesColored;
    Material: Material<ParticlesColoredLayout>;
    Phase: RenderPhase;
    Buffer: WebGLBuffer;
    ColorStart: Vec4;
    ColorEnd: Vec4;
    Size: Vec2;
    FrontFace: GLenum;
}

export function render_particles_colored(
    material: Material<ParticlesColoredLayout>,
    start_color: Vec4,
    start_size: number,
    end_color: Vec4,
    end_size: number
) {
    return (game: Game, entity: Entity) => {
        let buffer = game.Gl.createBuffer()!;
        game.Gl.bindBuffer(GL_ARRAY_BUFFER, buffer);
        game.Gl.bufferData(
            GL_ARRAY_BUFFER,
            MAX_PARTICLES * FLOATS_PER_PARTICLE * 4,
            GL_DYNAMIC_DRAW
        );

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ParticlesColored,
            Material: material,
            Phase:
                start_color[3] < 1 || end_color[3] < 1
                    ? RenderPhase.Transparent
                    : RenderPhase.Opaque,
            Buffer: buffer,
            ColorStart: start_color,
            ColorEnd: end_color,
            Size: [start_size, end_size],
            FrontFace: GL_CW,
        };
    };
}

export interface RenderParticlesTextured {
    Kind: RenderKind.ParticlesTextured;
    Material: Material<ParticlesTexturedLayout>;
    Phase: RenderPhase;
    Buffer: WebGLBuffer;
    Texture: WebGLTexture;
    ColorStart: Vec4;
    ColorEnd: Vec4;
    Size: Vec2;
    FrontFace: GLenum;
}

export function render_particles_textured(
    material: Material<ParticlesTexturedLayout>,
    texture: WebGLTexture,
    start_color: Vec4,
    start_size: number,
    end_color: Vec4,
    end_size: number
) {
    return (game: Game, entity: Entity) => {
        let buffer = game.Gl.createBuffer()!;
        game.Gl.bindBuffer(GL_ARRAY_BUFFER, buffer);
        game.Gl.bufferData(
            GL_ARRAY_BUFFER,
            MAX_PARTICLES * FLOATS_PER_PARTICLE * 4,
            GL_DYNAMIC_DRAW
        );

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ParticlesTextured,
            Material: material,
            Phase:
                start_color[3] < 1 || end_color[3] < 1
                    ? RenderPhase.Transparent
                    : RenderPhase.Opaque,
            Buffer: buffer,
            Texture: texture,
            ColorStart: start_color,
            ColorEnd: end_color,
            Size: [start_size, end_size],
            FrontFace: GL_CW,
        };
    };
}
