import {Material} from "../../common/material.js";
import {Vec4} from "../../common/math.js";
import {Mesh} from "../../common/mesh.js";
import {GL_CW} from "../../common/webgl.js";
import {Entity} from "../../common/world.js";
import {ColoredShadedLayout, ForwardShadingLayout} from "../../materials/layout.js";
import {Game} from "../game.js";
import {SkinningLayout} from "../materials/layout_skinning.js";
import {Has} from "../world.js";

export type Render = RenderColoredShaded | RenderColoredSkinned;

export const enum RenderKind {
    ColoredShaded,
    ColoredSkinned,
}

const colored_shaded_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();
const colored_skinned_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

export interface RenderColoredShaded {
    Kind: RenderKind.ColoredShaded;
    Material: Material<ColoredShadedLayout & ForwardShadingLayout>;
    Mesh: Mesh;
    FrontFace: GLenum;
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
        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ColoredShaded,
            Material: material,
            Mesh: mesh,
            FrontFace: front_face,
            DiffuseColor: diffuse_color,
            SpecularColor: specular_color,
            Shininess: shininess,
        };
    };
}

export interface RenderColoredSkinned {
    Kind: RenderKind.ColoredSkinned;
    Material: Material<ColoredShadedLayout & ForwardShadingLayout & SkinningLayout>;
    Mesh: Mesh;
    FrontFace: GLenum;
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
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ColoredSkinned,
            Material: material,
            Mesh: mesh,
            FrontFace: front_face,
            DiffuseColor: diffuse_color,
            SpecularColor: specular_color,
            Shininess: shininess,
        };
    };
}
