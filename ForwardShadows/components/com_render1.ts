import {Material} from "../../common/material.js";
import {Vec4} from "../../common/math.js";
import {Mesh} from "../../common/mesh.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_ELEMENT_ARRAY_BUFFER, GL_FLOAT} from "../../common/webgl.js";
import {ColoredShadedLayout} from "../../materials/layout_colored_shaded.js";
import {ForwardShadingLayout} from "../../materials/layout_forward_shading.js";
import {Entity, Game} from "../game.js";
import {ShadowMappingLayout} from "../materials/layout_shadow_mapping.js";
import {Has, World} from "../world.js";

export type Render = RenderColoredShadows;

export const enum RenderKind {
    ColoredShadows,
}

interface Game1 extends Game {
    Gl: WebGLRenderingContext;
    ExtVao: OES_vertex_array_object;
    World: World & {
        Render: Array<Render>;
    };
}

const colored_shadows_vaos: WeakMap<Mesh, WebGLVertexArrayObject> = new WeakMap();

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
    return (game: Game1, entity: Entity) => {
        if (!colored_shadows_vaos.has(mesh)) {
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
