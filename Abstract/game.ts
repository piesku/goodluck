import {Camera} from "./components/com_camera.js";
import {World} from "./world.js";

export type Entity = number;

export interface Game {
    World: World;

    ViewportWidth: number;
    ViewportHeight: number;
    ViewportResized: boolean;

    Canvas: HTMLCanvasElement;
    Camera?: Camera;

    FrameReset(): void;
    FrameUpdate(delta: number): void;
}
