import {
    frame_reset,
    frame_setup,
    input_init,
    input_pointer_lock,
    loop_start,
    loop_stop,
} from "./impl.js";
import {sys_draw2d} from "./systems/sys_draw2d.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_transform2d} from "./systems/sys_transform2d.js";
import {World} from "./world.js";

export type Entity = number;

export class Game {
    World = new World();

    ViewportWidth = window.innerWidth;
    ViewportHeight = window.innerHeight;
    ViewportResized = false;

    InputState: Record<string, number> = {};
    InputDelta: Record<string, number> = {};
    InputDistance: Record<string, number> = {};
    InputTouches: Record<string, number> = {};

    Ui = document.querySelector("main")!;
    Context2D: CanvasRenderingContext2D;

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop() : loop_start(this)
        );

        input_init(this);
        input_pointer_lock(this);

        let canvas2d = document.querySelector("canvas")!;
        canvas2d.width = this.ViewportWidth;
        canvas2d.height = this.ViewportHeight;
        this.Context2D = canvas2d.getContext("2d")!;
    }

    FrameUpdate(delta: number) {
        frame_setup(this);
        let now = performance.now();

        sys_transform2d(this, delta);
        sys_draw2d(this, delta);

        sys_framerate(this, delta, performance.now() - now);
        frame_reset(this);
    }
}
