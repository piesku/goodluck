import {Material} from "../../common/material.js";
import {Vec2, Vec4} from "../../common/math.js";
import {GL_ARRAY_BUFFER, GL_CW, GL_DYNAMIC_DRAW} from "../../common/webgl.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {ParticlesColoredLayout, ParticlesTexturedLayout} from "../materials/layout_particles.js";
import {Has} from "../world.js";

export type Render = RenderParticlesColored | RenderParticlesTextured;

export const enum RenderKind {
    ParticlesColored,
    ParticlesTextured,
}

export const DATA_PER_PARTICLE = 8;
export const MAX_PARTICLES = 200;

export interface RenderParticlesColored {
    readonly Kind: RenderKind.ParticlesColored;
    readonly Material: Material<ParticlesColoredLayout>;
    readonly Buffer: WebGLBuffer;
    readonly ColorStart: Vec4;
    readonly ColorEnd: Vec4;
    readonly Size: Vec2;
    readonly FrontFace: GLenum;
}

export function render_particles_colored(
    start_color: Vec4,
    start_size: number,
    end_color: Vec4,
    end_size: number
) {
    return (game: Game, entity: Entity) => {
        let buffer = game.Gl.createBuffer()!;
        game.Gl.bindBuffer(GL_ARRAY_BUFFER, buffer);
        game.Gl.bufferData(GL_ARRAY_BUFFER, MAX_PARTICLES * DATA_PER_PARTICLE * 4, GL_DYNAMIC_DRAW);

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ParticlesColored,
            Material: game.MaterialParticlesColored,
            Buffer: buffer,
            ColorStart: start_color,
            ColorEnd: end_color,
            Size: [start_size, end_size],
            FrontFace: GL_CW,
        };
    };
}

export interface RenderParticlesTextured {
    readonly Kind: RenderKind.ParticlesTextured;
    readonly Material: Material<ParticlesTexturedLayout>;
    readonly Buffer: WebGLBuffer;
    readonly Texture: WebGLTexture;
    readonly ColorStart: Vec4;
    readonly ColorEnd: Vec4;
    readonly Size: Vec2;
    readonly FrontFace: GLenum;
}

export function render_particles_textured(
    texture: WebGLTexture,
    start_color: Vec4,
    start_size: number,
    end_color: Vec4,
    end_size: number
) {
    return (game: Game, entity: Entity) => {
        let buffer = game.Gl.createBuffer()!;
        game.Gl.bindBuffer(GL_ARRAY_BUFFER, buffer);
        game.Gl.bufferData(GL_ARRAY_BUFFER, MAX_PARTICLES * DATA_PER_PARTICLE * 4, GL_DYNAMIC_DRAW);

        game.World.Signature[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.ParticlesTextured,
            Material: game.MaterialParticlesTextured,
            Buffer: buffer,
            Texture: texture,
            ColorStart: start_color,
            ColorEnd: end_color,
            Size: [start_size, end_size],
            FrontFace: GL_CW,
        };
    };
}
