import {RenderDiffuse} from "./com_render_diffuse.js";
import {RenderSpecular} from "./com_render_specular.js";

export type Render = RenderDiffuse | RenderSpecular;

export const enum RenderKind {
    Diffuse,
    Specular,
}
