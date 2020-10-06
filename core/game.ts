import {Camera} from "./components/com_camera.js";
import {World} from "./world.js";

export type Entity = number;

export interface Game {
    World: World;

    ViewportWidth: number;
    ViewportHeight: number;
    ViewportResized: boolean;

    Ui: HTMLElement;
    Audio: AudioContext;

    Canvas: HTMLCanvasElement;

    Billboard: HTMLCanvasElement;
    Context2D: CanvasRenderingContext2D;

    // The rendering pipeline supports 8 lights.
    LightPositions: Float32Array;
    LightDetails: Float32Array;
    Cameras: Array<Camera>;

    FrameReset(): void;
    FrameUpdate(delta: number): void;
}

export const enum Layer {
    None,
}
