import {RenderBasic} from "./com_render_basic.js";
import {RenderDiffuse} from "./com_render_diffuse.js";
import {RenderSpecular} from "./com_render_specular.js";

export type Render = RenderBasic | RenderDiffuse | RenderSpecular;

export const enum RenderKind {
    Basic,
    Diffuse,
    Specular,
}
