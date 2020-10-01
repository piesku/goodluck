import {Camera} from "./components/com_camera.js";
import {World} from "./world.js";

export type Entity = number;

export interface Game {
    World: World;

    ViewportWidth: number;
    ViewportHeight: number;
    ViewportResized: boolean;

    Canvas: HTMLCanvasElement;
    Audio: AudioContext;
    Camera?: Camera;

    Gl: WebGLRenderingContext;
    ExtVao: OES_vertex_array_object;

    // The rendering pipeline supports 8 lights.
    LightPositions: Float32Array;
    LightDetails: Float32Array;

    FrameReset(): void;
    FrameUpdate(delta: number): void;
}
