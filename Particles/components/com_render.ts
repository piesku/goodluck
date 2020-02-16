import {RenderParticles} from "./com_render_particles.js";
import {RenderShaded} from "./com_render_shaded.js";

export type Render = RenderShaded | RenderParticles;

export const enum RenderKind {
    Shaded,
    Particles,
}
