import {Camera} from "./components/com_camera.js";
import {World} from "./world.js";

export type Entity = number;

export class Game {
    World: World = new World();

    ViewportWidth: number = 0;
    ViewportHeight: number = 0;
    ViewportResized: boolean = true;

    Ui: HTMLElement = new HTMLElement();
    Audio: AudioContext = new AudioContext();

    Canvas: HTMLCanvasElement = new HTMLCanvasElement();

    Billboard: HTMLCanvasElement = new HTMLCanvasElement();
    Context2D: CanvasRenderingContext2D = new CanvasRenderingContext2D();

    LightPositions: Float32Array = new Float32Array();
    LightDetails: Float32Array = new Float32Array();
    Cameras: Array<Camera> = [];

    FrameReset() {}
    FrameUpdate(delta: number) {}
}

export const enum Layer {
    None,
}
