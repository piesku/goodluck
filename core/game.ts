import {DeferredTarget, DepthTarget, ForwardTarget} from "../common/framebuffer.js";
import {GameXR} from "../common/game.js";
import {Material} from "../common/material.js";
import {Mesh} from "../common/mesh.js";
import {Entity} from "../common/world.js";
import {
    ColoredUnlitLayout,
    DeferredPostprocessLayout,
    DepthMappingLayout,
    ForwardShadingLayout,
    PostprocessLayout,
    ShadowMappingLayout,
} from "../materials/layout.js";
import {World} from "./world.js";

// A synthetic interface to make all core/components and core/systems compile.
// The examples symlink core files into their directories and thus make them
// import their own Game class.
export interface Game extends GameXR {
    World: World;

    Targets: {
        Gbuffer: DeferredTarget;
        Shaded: ForwardTarget;
        Sun: DepthTarget;
    };

    MaterialWireframe: Material<ColoredUnlitLayout>;
    MaterialShading: Material<
        DeferredPostprocessLayout & ForwardShadingLayout & ShadowMappingLayout
    >;
    MaterialPostprocess: Material<PostprocessLayout>;
    MaterialDepth: Material<DepthMappingLayout>;

    MeshQuad: Mesh;
    MeshCube: Mesh;

    LightPositions: Float32Array;
    LightDetails: Float32Array;
    Cameras: Array<Entity>;
}

export const enum Layer {
    None,
}
