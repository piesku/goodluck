import {Blueprint2D} from "./blueprints/blu_common.js";
import {Has} from "./components/com_index.js";
import {transform2d} from "./components/com_transform2d.js";
import {sys_draw2d} from "./systems/sys_draw2d.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_performance} from "./systems/sys_performance.js";
import {sys_transform2d} from "./systems/sys_transform2d.js";
import {World} from "./world.js";

const MAX_ENTITIES = 10000;

export type Entity = number;

export interface InputState {
    [k: string]: number;
    mouse_x: number;
    mouse_y: number;
}

export interface InputEvent {
    [k: string]: number;
    mouse_x: number;
    mouse_y: number;
    wheel_y: number;
}

export class Game {
    public World = new World();

    public ViewportWidth = window.innerWidth;
    public ViewportHeight = window.innerHeight;
    public Context2D: CanvasRenderingContext2D;
    public UI = document.querySelector("main")!;
    public InputState: InputState = {mouse_x: 0, mouse_y: 0};
    public InputEvent: InputEvent = {mouse_x: 0, mouse_y: 0, wheel_y: 0};

    private RAF: number = 0;

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? this.Stop() : this.Start()
        );

        window.addEventListener("keydown", evt => (this.InputState[evt.code] = 1));
        window.addEventListener("keyup", evt => (this.InputState[evt.code] = 0));
        this.UI.addEventListener("contextmenu", evt => evt.preventDefault());
        this.UI.addEventListener("mousedown", evt => {
            this.InputState[`mouse_${evt.button}`] = 1;
            this.InputEvent[`mouse_${evt.button}_down`] = 1;
        });
        this.UI.addEventListener("mouseup", evt => {
            this.InputState[`mouse_${evt.button}`] = 0;
            this.InputEvent[`mouse_${evt.button}_up`] = 1;
        });
        this.UI.addEventListener("mousemove", evt => {
            this.InputState.mouse_x = evt.offsetX;
            this.InputState.mouse_y = evt.offsetY;
            this.InputEvent.mouse_x = evt.movementX;
            this.InputEvent.mouse_y = evt.movementY;
        });
        this.UI.addEventListener("wheel", evt => {
            this.InputEvent.wheel_y = evt.deltaY;
        });
        this.UI.addEventListener("click", () => this.UI.requestPointerLock());

        let canvas2d = document.querySelector("canvas")!;
        canvas2d.width = this.ViewportWidth;
        canvas2d.height = this.ViewportHeight;
        this.Context2D = canvas2d.getContext("2d")!;
    }

    Update(delta: number) {
        let now = performance.now();
        sys_transform2d(this, delta);
        sys_draw2d(this, delta);
        sys_framerate(this, delta);
        sys_performance(this, performance.now() - now, document.querySelector("#frame"));
    }

    Start() {
        let last = performance.now();

        let tick = (now: number) => {
            let delta = (now - last) / 1000;
            this.Update(delta);

            // Reset all input events for the next frame.
            for (let name in this.InputEvent) {
                this.InputEvent[name] = 0;
            }

            last = now;
            this.RAF = requestAnimationFrame(tick);
        };

        this.Stop();
        tick(last);
    }

    Stop() {
        cancelAnimationFrame(this.RAF);
    }

    CreateEntity(mask: number = 0) {
        for (let i = 0; i < MAX_ENTITIES; i++) {
            if (!this.World.Mask[i]) {
                this.World.Mask[i] = mask;
                return i;
            }
        }
        throw new Error("No more entities available.");
    }

    Add({Translation, Rotation, Scale, Using = [], Children = []}: Blueprint2D) {
        let entity = this.CreateEntity();
        transform2d(Translation, Rotation, Scale)(this, entity);
        for (let mixin of Using) {
            mixin(this, entity);
        }
        let entity_transform = this.World.Transform2D[entity];
        for (let subtree of Children) {
            let child = this.Add(subtree);
            let child_transform = this.World.Transform2D[child];
            child_transform.Parent = entity_transform;
            entity_transform.Children.push(child_transform);
        }
        return entity;
    }

    Destroy(entity: Entity) {
        let mask = this.World.Mask[entity];
        if (mask & Has.Transform2D) {
            for (let child of this.World.Transform2D[entity].Children) {
                this.Destroy(child.EntityId);
            }
        }
        this.World.Mask[entity] = 0;
    }
}
