import {Material} from "../../common/material.js";
import {Vec3, Vec4} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderParticles {
    readonly Kind: RenderKind.Particles;
    readonly Material: Material;
    readonly Buffer: WebGLBuffer;
    readonly ColorSizeStart: Vec4;
    readonly ColorSizeEnd: Vec4;
}

export function render_particles(
    start_color: Vec3,
    start_size: number,
    end_color: Vec3,
    end_size: number
) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Particles,
            Material: game.MaterialParticles,
            Buffer: game.GL.createBuffer()!,
            ColorSizeStart: <Vec4>[...start_color, start_size],
            ColorSizeEnd: <Vec4>[...end_color, end_size],
        };
    };
}

export const enum ParticleAttribute {
    Origin = 1,
}

export const enum ParticleUniform {
    PV,
    ColorSizeStart,
    ColorSizeEnd,
}
