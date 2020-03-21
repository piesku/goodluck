import {RenderBasic} from "./com_render_basic.js";
import {RenderDiffuse} from "./com_render_diffuse.js";

export type Render = RenderBasic | RenderDiffuse;

export const enum RenderKind {
    Basic,
    Diffuse,
}
