import {RenderBasic} from "./com_render_basic.js";
import {RenderShaded} from "./com_render_shaded.js";
import {RenderInstanced} from "./com_render_vox.js";

export type Render = RenderBasic | RenderShaded | RenderInstanced;

export const enum RenderKind {
    Basic,
    Shaded,
    Instanced,
}
