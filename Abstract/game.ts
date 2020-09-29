import {World} from "./world.js";

export type Entity = number;

export interface Game {
    World: World;

    FrameReset(): void;
    FrameUpdate(delta: number): void;
}
