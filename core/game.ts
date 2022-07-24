import {DeferredTarget, DepthTarget, ForwardTarget, RenderTarget} from "../common/framebuffer.js";
import {GameXR} from "../common/game.js";
import {Material} from "../common/material.js";
import {Mesh} from "../common/mesh.js";
import {Spritesheet} from "../common/texture.js";
import {Entity} from "../common/world.js";
import {
    ColoredUnlitLayout,
    DeferredShadingLayout,
    PostprocessLayout,
    ShadowMappingLayout,
    WorldSpaceLayout,
} from "../materials/layout.js";
import {Instanced2DLayout} from "../materials/layout2d.js";
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

    MaterialInstanced: Material<Instanced2DLayout>;
    Spritesheets: Record<string, Spritesheet>;
    InstanceData: Float32Array;
    InstanceBuffer: WebGLBuffer;
}

export const enum Layer {
    None,
}
