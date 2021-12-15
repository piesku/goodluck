import {RenderTarget} from "./framebuffer.js";
import {GL_CULL_FACE, GL_DEPTH_TEST, GL_ONE_MINUS_SRC_ALPHA, GL_SRC_ALPHA} from "./webgl.js";
import {Entity, WorldImpl} from "./world.js";

const update_span = document.getElementById("update");
const delta_span = document.getElementById("delta");
const fps_span = document.getElementById("fps");
const step = 1 / 60;

export abstract class GameImpl {
    Running = 0;
    Now = 0;

    abstract World: WorldImpl;

    ViewportWidth = window.innerWidth;
    ViewportHeight = window.innerHeight;
    ViewportResized = true;

    // State of input during this frame.
    // 1 = down, 0 = up, or any number for analog inputs.
    InputState: Record<string, number> = {
        MouseX: 0,
        MouseY: 0,
    };
    // Changes of InputState that happened right before this frame.
    // 1 = pressed, -1 = released, 0 = no change.
    InputDelta: Record<string, number> = {
        MouseX: 0,
        MouseY: 0,
    };
    // Pixels traveled while mouse/touch was down.
    InputDistance: Record<string, number> = {
        Mouse: 0,
        Mouse0: 0,
        Mouse1: 0,
        Mouse2: 0,
        Touch0: 0,
        Touch1: 0,
    };
    // Map of touch ids to touch indices. In particular, Firefox assigns high
    // ints as ids. Chrome usually starts at 0, so id === index.
    InputTouches: Record<string, number> = {};

    Ui = document.querySelector("main")!;

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? this.Stop() : this.Start()
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
            if (evt.target === this.Ui) {
                // Prevent browsers from interpreting touch gestures as navigation input.
                evt.preventDefault();
            }

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
            if (evt.target === this.Ui) {
                // Prevent browsers from interpreting touch gestures as navigation input.
                evt.preventDefault();
            }

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
            if (evt.target === this.Ui) {
                // Prevent browsers from interpreting touch gestures as navigation input.
                evt.preventDefault();
            }

            for (let i = 0; i < evt.changedTouches.length; i++) {
                let touch = evt.changedTouches[i];
                let index = this.InputTouches[touch.identifier];
                this.InputState[`Touch${index}`] = 0;
                this.InputDelta[`Touch${index}`] = -1;
            }
        });
        this.Ui.addEventListener("touchcancel", (evt) => {
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

    Start() {
        let accumulator = 0;
        let last = performance.now();

        let tick = (now: number) => {
            let delta = (now - last) / 1000;
            last = now;

            this.Running = requestAnimationFrame(tick);

            this.FrameSetup(delta);
            accumulator += delta;
            while (accumulator >= step) {
                accumulator -= step;
                // TODO Adjust InputDelta and InputDistance.
                this.FixedUpdate(step);
            }
            this.FrameUpdate(delta);
            this.FrameReset(delta);
        };

        this.Stop();
        tick(last);
    }

    Stop() {
        cancelAnimationFrame(this.Running);
        this.Running = 0;
    }

    FrameSetup(delta: number) {
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

    FixedUpdate(step: number) {}
    FrameUpdate(delta: number) {}

    FrameReset(delta: number) {
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

        let update = performance.now() - this.Now;
        if (update_span) {
            update_span.textContent = update.toFixed(1);
        }
        if (delta_span) {
            delta_span.textContent = (delta * 1000).toFixed(1);
        }
        if (fps_span) {
            fps_span.textContent = (1 / delta).toFixed();
        }
    }
}

export abstract class Game2D extends GameImpl {
    Canvas2D = document.querySelector("canvas")!;
    Context2D = this.Canvas2D.getContext("2d")!;
    Audio = new AudioContext();

    constructor() {
        super();

        this.Canvas2D.width = this.ViewportWidth;
        this.Canvas2D.height = this.ViewportHeight;
        this.Context2D = this.Canvas2D.getContext("2d")!;
    }
}

export abstract class Game3D extends GameImpl {
    Canvas2D = document.querySelector("#billboard")! as HTMLCanvasElement;
    Context2D = this.Canvas2D.getContext("2d")!;

    Canvas3D = document.querySelector("#scene")! as HTMLCanvasElement;
    Gl = this.Canvas3D.getContext("webgl2")!;

    Audio = new AudioContext();
    Cameras: Array<Entity> = [];
    Targets: Record<string, RenderTarget> = {};

    constructor() {
        super();

        this.Gl.enable(GL_DEPTH_TEST);
        this.Gl.enable(GL_CULL_FACE);

        this.Gl.blendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    }

    override FrameSetup(delta: number) {
        super.FrameSetup(delta);
        this.Cameras = [];
    }
}

export abstract class GameXR extends Game3D {
    XrSupported = false;
    XrSession?: XRSession;
    XrSpace?: XRReferenceSpace;
    // XrFrame can be used to check whether we're presenting to a VR display.
    XrFrame?: XRFrame;
    XrInputs: Record<string, XRInputSource> = {};

    constructor() {
        super();

        this.Gl.enable(GL_DEPTH_TEST);
        this.Gl.enable(GL_CULL_FACE);

        this.Gl.blendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

        if (navigator.xr) {
            xr_init(this);
        }
    }

    override Start() {
        let accumulator = 0;
        let last = performance.now();

        let tick = (now: number, frame?: XRFrame) => {
            let delta = (now - last) / 1000;
            last = now;

            if (frame) {
                this.XrFrame = frame;
                this.Running = this.XrFrame.session.requestAnimationFrame(tick);
            } else {
                this.XrFrame = undefined;
                this.Running = requestAnimationFrame(tick);
            }

            this.FrameSetup(delta);
            accumulator += delta;
            while (accumulator >= step) {
                accumulator -= step;
                // TODO Adjust InputDelta and InputDistance.
                this.FixedUpdate(step);
            }
            this.FrameUpdate(delta);
            this.FrameReset(delta);
        };

        if (this.XrSession) {
            this.Running = this.XrSession.requestAnimationFrame(tick);
        } else {
            this.Running = requestAnimationFrame(tick);
        }
    }

    override Stop() {
        if (this.XrSession) {
            this.XrSession.cancelAnimationFrame(this.Running);
        } else {
            cancelAnimationFrame(this.Running);
        }
        this.Running = 0;
    }

    async EnterXR() {
        let session = await navigator.xr.requestSession("immersive-vr");
        session.updateRenderState({
            baseLayer: new XRWebGLLayer(session, this.Gl),
        });
        this.XrSpace = await session.requestReferenceSpace("local");

        this.Stop();
        this.XrSession = session;
        this.Start();

        this.XrSession.addEventListener("end", () => {
            this.Stop();
            this.XrSession = undefined;
            this.XrSpace = undefined;
            this.XrFrame = undefined;
            this.ViewportResized = true;
            this.Start();
        });
    }

    override FrameSetup(delta: number) {
        super.FrameSetup(delta);

        if (this.XrFrame) {
            this.XrInputs = {};
            for (let input of this.XrFrame.session.inputSources) {
                if (input.gripSpace) {
                    this.XrInputs[input.handedness] = input;
                }
            }
        }
    }
}

type Mixin<G extends GameImpl> = (game: G, entity: Entity) => void;
export type Blueprint<G extends GameImpl> = Array<Mixin<G>>;

export function instantiate<G extends GameImpl>(game: G, blueprint: Blueprint<G>) {
    let entity = game.World.CreateEntity();
    for (let mixin of blueprint) {
        mixin(game, entity);
    }
    return entity;
}

// Implemented as a free function so that we can use async/await.
async function xr_init(game: GameXR) {
    await game.Gl.makeXRCompatible();
    game.XrSupported = await navigator.xr.isSessionSupported("immersive-vr");
}
