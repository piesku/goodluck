import {GameImpl} from "../common/game.js";
import {World} from "./world.js";

export type Entity = number;

export interface Game extends GameImpl {
    World: World;

    Audio: AudioContext;
    Canvas2D: HTMLCanvasElement;
    Context2D: CanvasRenderingContext2D;
    Canvas3D: HTMLCanvasElement;

    // The rendering pipeline supports 8 lights.
    LightPositions: Float32Array;
    LightDetails: Float32Array;
    Cameras: Array<Entity>;
}

export const enum Layer {
    None,
}
