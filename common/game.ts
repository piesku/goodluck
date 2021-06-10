import {Vec2} from "./math.js";
import {Entity, WorldImpl} from "./world.js";

export class GameImpl {
    Raf = 0;
    Now = 0;

    ViewportWidth = window.innerWidth;
    ViewportHeight = window.innerHeight;
    ViewportResized = true;

    InputState: Record<string, number> = {
        MouseX: 0,
        MouseY: 0,
    };
    InputDelta: Record<string, number> = {
        MouseX: 0,
        MouseY: 0,
    };
    InputDistance: Record<string, number> = {
        Mouse: 0,
        Mouse0: 0,
        Mouse1: 0,
        Mouse2: 0,
        Touch0: 0,
        Touch1: 0,
    };
    InputTouches: Record<string, number> = {};

    Ui = document.querySelector("main")!;

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? this.Pause() : this.Resume()
        );

        this.Ui.addEventListener("contextmenu", (evt) => evt.preventDefault());

        this.Ui.addEventListener("mousedown", (evt) => {
            this.InputState[`Mouse${evt.button}`] = 1;
            this.InputDelta[`Mouse${evt.button}`] = 1;
        });
        this.Ui.addEventListener("mouseup", (evt) => {
            this.InputState[`Mouse${evt.button}`] = 0;
            this.InputDelta[`Mouse${evt.button}`] = -1;
        });
        this.Ui.addEventListener("mousemove", (evt) => {
            this.InputState["MouseX"] = evt.clientX;
            this.InputState["MouseY"] = evt.clientY;
            this.InputDelta["MouseX"] = evt.movementX;
            this.InputDelta["MouseY"] = evt.movementY;
        });
        this.Ui.addEventListener("wheel", (evt) => {
            evt.preventDefault();
            this.InputDelta["WheelY"] = evt.deltaY;
        });

        this.Ui.addEventListener("touchstart", (evt) => {
            evt.preventDefault();
            if (evt.touches.length === 1) {
                // It's a new gesture.
                this.InputTouches = {};
            }
            for (let i = 0; i < evt.touches.length; i++) {
                let touch = evt.touches[i];
                this.InputTouches[touch.identifier] = i;
            }
            for (let i = 0; i < evt.changedTouches.length; i++) {
                let touch = evt.changedTouches[i];
                let index = this.InputTouches[touch.identifier];
                this.InputState[`Touch${index}`] = 1;
                this.InputState[`Touch${index}X`] = touch.clientX;
                this.InputState[`Touch${index}Y`] = touch.clientY;
                this.InputDelta[`Touch${index}`] = 1;
                this.InputDelta[`Touch${index}X`] = 0;
                this.InputDelta[`Touch${index}Y`] = 0;
            }
        });
        this.Ui.addEventListener("touchmove", (evt) => {
            evt.preventDefault();
            for (let i = 0; i < evt.changedTouches.length; i++) {
                let touch = evt.changedTouches[i];
                let index = this.InputTouches[touch.identifier];
                this.InputDelta[`Touch${index}X`] =
                    touch.clientX - this.InputState[`Touch${index}X`];
                this.InputDelta[`Touch${index}Y`] =
                    touch.clientY - this.InputState[`Touch${index}Y`];
                this.InputState[`Touch${index}X`] = touch.clientX;
                this.InputState[`Touch${index}Y`] = touch.clientY;
            }
        });
        this.Ui.addEventListener("touchend", (evt) => {
            evt.preventDefault();
            for (let i = 0; i < evt.changedTouches.length; i++) {
                let touch = evt.changedTouches[i];
                let index = this.InputTouches[touch.identifier];
                this.InputState[`Touch${index}`] = 0;
                this.InputDelta[`Touch${index}`] = -1;
            }
        });
        this.Ui.addEventListener("touchcancel", (evt) => {
            evt.preventDefault();
            for (let i = 0; i < evt.changedTouches.length; i++) {
                let touch = evt.changedTouches[i];
                let index = this.InputTouches[touch.identifier];
                this.InputState[`Touch${index}`] = 0;
                this.InputDelta[`Touch${index}`] = -1;
            }
        });

        window.addEventListener("keydown", (evt) => {
            if (!evt.repeat) {
                this.InputState[evt.code] = 1;
                this.InputDelta[evt.code] = 1;
            }
        });
        window.addEventListener("keyup", (evt) => {
            this.InputState[evt.code] = 0;
            this.InputDelta[evt.code] = -1;
        });
    }

    Resume() {
        let last = performance.now();

        let tick = (now: number) => {
            let delta = (now - last) / 1000;
            this.FrameSetup();
            this.FrameUpdate(delta);
            this.FrameReset();
            last = now;
            this.Raf = requestAnimationFrame(tick);
        };

        this.Pause();
        tick(last);
    }

    Pause() {
        cancelAnimationFrame(this.Raf);
    }

    FrameSetup() {
        this.Now = performance.now();

        let mouse_distance =
            Math.abs(this.InputDelta["MouseX"]) + Math.abs(this.InputDelta["MouseY"]);
        this.InputDistance["Mouse"] += mouse_distance;

        if (this.InputState["Mouse0"] === 1) {
            this.InputDistance["Mouse0"] += mouse_distance;
        }
        if (this.InputState["Mouse1"] === 1) {
            this.InputDistance["Mouse1"] += mouse_distance;
        }
        if (this.InputState["Mouse2"] === 1) {
            this.InputDistance["Mouse2"] += mouse_distance;
        }

        if (this.InputState["Touch0"] === 1) {
            this.InputDistance["Touch0"] +=
                Math.abs(this.InputDelta["Touch0X"]) + Math.abs(this.InputDelta["Touch0Y"]);
        }
        if (this.InputState["Touch1"] === 1) {
            this.InputDistance["Touch1"] +=
                Math.abs(this.InputDelta["Touch1X"]) + Math.abs(this.InputDelta["Touch1Y"]);
        }
    }

    FrameUpdate(delta: number) {}

    FrameReset() {
        this.ViewportResized = false;

        if (this.InputDelta["Mouse0"] === -1) {
            this.InputDistance["Mouse0"] = 0;
        }
        if (this.InputDelta["Mouse1"] === -1) {
            this.InputDistance["Mouse1"] = 0;
        }
        if (this.InputDelta["Mouse2"] === -1) {
            this.InputDistance["Mouse2"] = 0;
        }

        if (this.InputDelta["Touch0"] === -1) {
            this.InputDistance["Touch0"] = 0;
        }
        if (this.InputDelta["Touch1"] === -1) {
            this.InputDistance["Touch1"] = 0;
        }

        for (let name in this.InputDelta) {
            this.InputDelta[name] = 0;
        }
    }
}

export type Mixin<G extends GameImpl> = (game: G, entity: Entity) => void;
export type Blueprint<G extends GameImpl> = Array<Mixin<G>>;

export function instantiate<G extends GameImpl & {World: WorldImpl}>(
    game: G,
    blueprint: Blueprint<G>
) {
    let entity = game.World.CreateEntity();
    for (let mixin of blueprint) {
        mixin(game, entity);
    }
    return entity;
}

export function input_pointer_lock(game: GameImpl) {
    game.Ui.addEventListener("click", () => game.Ui.requestPointerLock());
}

export function input_clicked(game: GameImpl, mouse_button: number, touch_id: number) {
    return (
        (game.InputDelta["Mouse" + mouse_button] === -1 &&
            game.InputDistance["Mouse" + mouse_button] < 10) ||
        (game.InputDelta["Touch" + touch_id] === -1 && game.InputDistance["Touch" + touch_id] < 10)
    );
}

export function input_pointer_position(game: GameImpl): Vec2 | null {
    if (game.InputState["Touch0"] === 1 || game.InputDelta["Touch0"] === -1) {
        return [game.InputState["Touch0X"], game.InputState["Touch0Y"]];
    }

    if (game.InputDistance["Mouse"] > 0) {
        return [game.InputState["MouseX"], game.InputState["MouseY"]];
    }

    // No mouse, no touch.
    return null;
}
