import {RenderBasic} from "./com_render_basic.js";
import {RenderShaded} from "./com_render_shaded.js";

export type RenderGeneric = RenderBasic | RenderShaded;

export const enum Render {
    Basic,
    Shaded,
}
