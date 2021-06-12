import {GameImpl} from "../common/game.js";
import {World} from "./world.js";

export type Entity = number;

export interface Game extends GameImpl {
    World: World;

    Audio: AudioContext;
    Billboard: HTMLCanvasElement;
    Canvas: HTMLCanvasElement;
    Context2D: CanvasRenderingContext2D;

    // The rendering pipeline supports 8 lights.
    LightPositions: Float32Array;
    LightDetails: Float32Array;
    Cameras: Array<Entity>;
}

export const enum Layer {
    None,
}
