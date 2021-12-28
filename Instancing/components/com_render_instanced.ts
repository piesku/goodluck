/**
 * @module components/com_render
 */

import {Material} from "../../common/material.js";
import {Mesh} from "../../common/mesh.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_STATIC_DRAW} from "../../common/webgl.js";
import {Entity} from "../../common/world.js";
import {WorldSpaceLayout} from "../../materials/layout.js";
import {Game} from "../game.js";
import {
    FogLayout,
    InstancedColorLayout,
    InstancedColumnLayout,
} from "../materials/layout_instancing.js";
import {Has} from "../world.js";

export type Render = RenderInstanced;

export const enum RenderKind {
    ColoredUnlit,
    ColoredShaded,
    ColoredShadows,
    ColoredDeferred,
    TexturedUnlit,
    TexturedShaded,
    MappedShaded,
    Vertices,
    Instanced,
}

export const enum RenderPhase {
    Opaque,
    Transparent,
}

export interface RenderInstanced {
    readonly Kind: RenderKind.Instanced;
    Material: Material<WorldSpaceLayout & InstancedColumnLayout & InstancedColorLayout & FogLayout>;
    Phase: RenderPhase;
    Mesh: Mesh;
    InstanceCount: number;
    InstanceTransforms: WebGLBuffer;
    InstanceColors: WebGLBuffer;
    FrontFace: GLenum;
}

export function render_instanced_colored_unlit(
    mesh: Mesh,
    transforms: Float32Array,
    colors: Float32Array
) {
    return (game: Game, entity: Entity) => {
        let instance_transforms_buffer = game.Gl.createBuffer()!;
        game.Gl.bindBuffer(GL_ARRAY_BUFFER, instance_transforms_buffer);
        game.Gl.bufferData(GL_ARRAY_BUFFER, transforms, GL_STATIC_DRAW);

        let instance_colors_buffer = game.Gl.createBuffer()!;
        game.Gl.bindBuffer(GL_ARRAY_BUFFER, instance_colors_buffer);
        game.Gl.bufferData(GL_ARRAY_BUFFER, colors, GL_STATIC_DRAW);

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Instanced,
            Material: game.MaterialInstancedColoredUnlit,
            Phase: RenderPhase.Opaque,
            Mesh: mesh,
            InstanceCount: transforms.length / 16,
            InstanceTransforms: instance_transforms_buffer,
            InstanceColors: instance_colors_buffer,
            FrontFace: GL_CW,
        };
    };
}
