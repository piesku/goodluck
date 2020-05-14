import {loop_start, loop_stop} from "./core.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_ui} from "./systems/sys_ui.js";

export class Game {
    Ui = document.querySelector("main")!;

    Todos: Array<string> = [];
    Completed: Array<string> = [];

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? loop_stop() : loop_start(this)
        );
    }

    FrameUpdate(delta: number) {
        let now = performance.now();
        sys_ui(this, delta);
        sys_framerate(this, delta, performance.now() - now);
    }
}
