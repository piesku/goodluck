import {RenderBasic} from "./com_render_basic.js";
import {RenderShaded} from "./com_render_shaded.js";
import {RenderSpecular} from "./com_render_specular.js";

export type Render = RenderBasic | RenderShaded | RenderSpecular;

export const enum RenderKind {
    Basic,
    Shaded,
    Specular,
}
