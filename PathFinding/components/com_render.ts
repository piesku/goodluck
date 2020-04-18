import {RenderBasic} from "./com_render_basic.js";
import {RenderDiffuse} from "./com_render_diffuse.js";
import {RenderPath} from "./com_render_path.js";

export type Render = RenderBasic | RenderDiffuse | RenderPath;

export const enum RenderKind {
    Basic,
    Diffuse,
    Path,
}
