import {World} from "./world.js";

export type Entity = number;

export interface Game {
    World: World;

    ViewportWidth: number;
    ViewportHeight: number;
    ViewportResized: boolean;

    // State of input during this frame.
    // 1 = down, 0 = up, or any number for analog inputs.
    InputState: Record<string, number>;
    // Changes of InputState that happened right before this frame.
    // 1 = pressed, -1 = released, 0 = no change.
    InputDelta: Record<string, number>;
    // Pixels traveled while mouse/touch was down.
    InputDistance: Record<string, number>;
    // Map of touch ids to touch indices. In particular, Firefox assigns high
    // ints as ids. Chrome usually starts at 0, so id === index.
    InputTouches: Record<number, number>;

    Ui: HTMLElement;
    Audio: AudioContext;

    Canvas: HTMLCanvasElement;

    Billboard: HTMLCanvasElement;
    Context2D: CanvasRenderingContext2D;

    // The rendering pipeline supports 8 lights.
    LightPositions: Float32Array;
    LightDetails: Float32Array;
    Cameras: Array<Entity>;

    FrameUpdate(delta: number): void;
}

export const enum Layer {
    None,
}
