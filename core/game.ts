import {DeferredTarget, DepthTarget, ForwardTarget, RenderTarget} from "../lib/framebuffer.js";
import {GameXR} from "../lib/game.js";
import {Material} from "../lib/material.js";
import {Mesh} from "../lib/mesh.js";
import {Spritesheet} from "../lib/texture.js";
import {Entity} from "../lib/world.js";
import {
    ColoredUnlitLayout,
    DeferredShadingLayout,
    PostprocessLayout,
    ShadowMappingLayout,
    WorldSpaceLayout,
} from "../materials/layout.js";
import {Render2DLayout} from "../materials/layout2d.js";
import {World} from "./world.js";

export const WORLD_CAPACITY = 100_000;
export const FLOATS_PER_INSTANCE = 16;
export const BYTES_PER_INSTANCE = FLOATS_PER_INSTANCE * 4;
export const UNIT_PX = 32;

// A synthetic interface to make all core/components and core/systems compile.
// The examples symlink core files into their directories and thus make them
// import their own Game class.
export interface Game extends GameXR {
    World: World;

    Targets: {
        [name: string]: RenderTarget;
        Gbuffer: DeferredTarget;
        Shaded: ForwardTarget;
        Sun: DepthTarget;
        Back: DepthTarget;
    };

    MaterialWireframe: Material<ColoredUnlitLayout>;
    MaterialShading: Material<WorldSpaceLayout & DeferredShadingLayout & ShadowMappingLayout>;
    MaterialPostprocessFXAA: Material<PostprocessLayout>;
    MaterialDepth: Material<WorldSpaceLayout>;

    MeshQuad: Mesh;
    MeshCube: Mesh;
    MeshSphereSmooth: Mesh;

    LightPositions: Float32Array;
    LightDetails: Float32Array;
    Cameras: Array<Entity>;

    MaterialRender2D: Material<Render2DLayout>;
    Spritesheet: Spritesheet;
    InstanceBuffer: WebGLBuffer;
    UnitSize: number;
}

export const enum Layer {
    None,
}
