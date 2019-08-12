import {RenderBasic} from "./com_render_basic.js";
import {RenderShaded} from "./com_render_shaded.js";

export type Render = RenderBasic | RenderShaded;

export const enum RenderKind {
    Basic,
    Shaded,
}
