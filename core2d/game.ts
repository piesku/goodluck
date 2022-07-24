import {Game3D} from "../common/game.js";
import {Material} from "../common/material.js";
import {Spritesheet} from "../common/texture.js";
import {Instanced2DLayout} from "./materials/layout_instanced2d.js";
import {World} from "./world.js";

export const WORLD_CAPACITY = 100_000;
export const FLOATS_PER_INSTANCE = 16;
export const BYTES_PER_INSTANCE = FLOATS_PER_INSTANCE * 4;
export const UNIT_PX = 32;

// A synthetic interface to make all core/components and core/systems compile.
// The examples symlink core files into their directories and thus make them
// import their own Game class.
export interface Game extends Game3D {
    World: World;

    MaterialInstanced: Material<Instanced2DLayout>;
    Spritesheets: Record<string, Spritesheet>;

    InstanceData: Float32Array;
    InstanceBuffer: WebGLBuffer;
}

export const enum Layer {
    None,
}
