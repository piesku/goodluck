import {DeferredTarget, DepthTarget, ForwardTarget, RenderTarget} from "../common/framebuffer.js";
import {GameXR} from "../common/game.js";
import {Material} from "../common/material.js";
import {Mesh} from "../common/mesh.js";
import {Entity} from "../common/world.js";
import {
    ColoredUnlitLayout,
    DeferredShadingLayout,
    PostprocessLayout,
    ShadowMappingLayout,
    WorldSpaceLayout,
} from "../materials/layout.js";
import {World} from "./world.js";

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
}

export const enum Layer {
    None,
}
