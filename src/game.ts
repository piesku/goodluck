import {Action, effect} from "./actions.js";
import {Blueprint} from "./blueprints/blu_common.js";
import {Animate} from "./components/com_animate.js";
import {AudioSource} from "./components/com_audio_source.js";
import {Camera} from "./components/com_camera.js";
import {Collide} from "./components/com_collide.js";
import {ComponentData, Get} from "./components/com_index.js";
import {Light} from "./components/com_light.js";
import {Move} from "./components/com_move.js";
import {Named} from "./components/com_named.js";
import {PlayerControl} from "./components/com_player_control.js";
import {Render} from "./components/com_render.js";
import {RigidBody} from "./components/com_rigid_body.js";
import {transform, Transform} from "./components/com_transform.js";
import {Trigger} from "./components/com_trigger.js";
import {mat_basic} from "./materials/mat_basic.js";
import {Material} from "./materials/mat_common.js";
import {mat_flat} from "./materials/mat_flat.js";
import {mat_gouraud} from "./materials/mat_gouraud.js";
import {Mat} from "./materials/mat_index.js";
import {mat_phong} from "./materials/mat_phong.js";
import {mat_points} from "./materials/mat_points.js";
import {mat_wireframe} from "./materials/mat_wireframe.js";
import {sys_animate} from "./systems/sys_animate.js";
import {sys_audio} from "./systems/sys_audio.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_debug} from "./systems/sys_debug.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_physics} from "./systems/sys_physics.js";
import {sys_player_move} from "./systems/sys_player_move.js";
import {sys_render} from "./systems/sys_render.js";
import {sys_transform} from "./systems/sys_transform.js";
import {sys_trigger} from "./systems/sys_trigger.js";
import {sys_ui} from "./systems/sys_ui.js";
import {INIT_UI_STATE, reducer, UIState} from "./ui/state.js";

const MAX_ENTITIES = 10000;

export type Entity = number;

export interface Input {
    [k: string]: number;
    mouse_x: number;
    mouse_y: number;
}

export class Game implements ComponentData {
    public World: Array<number>;
    public [Get.Transform]: Array<Transform> = [];
    public [Get.Render]: Array<Render> = [];
    public [Get.Camera]: Array<Camera> = [];
    public [Get.Light]: Array<Light> = [];
    public [Get.AudioSource]: Array<AudioSource> = [];
    public [Get.Animate]: Array<Animate> = [];
    public [Get.Named]: Array<Named> = [];
    public [Get.Move]: Array<Move> = [];
    public [Get.PlayerControl]: Array<PlayerControl> = [];
    public [Get.Collide]: Array<Collide> = [];
    public [Get.RigidBody]: Array<RigidBody> = [];
    public [Get.Trigger]: Array<Trigger> = [];
    public Canvas: HTMLCanvasElement;
    public GL: WebGL2RenderingContext;
    public Audio: AudioContext = new AudioContext();
    public Input: Input = {mouse_x: 0, mouse_y: 0};
    public UI: UIState = INIT_UI_STATE;
    public Dispatch = (action: Action, ...args: Array<unknown>) => {
        this.UI = reducer(this.UI, action, args);
        effect(this, action, args);
    };
    public Materials: Array<Material> = [];
    public Cameras: Array<Camera> = [];
    public Lights: Array<Light> = [];
    private RAF: number = 0;

    constructor() {
        this.World = [];

        document.addEventListener("visibilitychange", () =>
            document.hidden ? this.stop() : this.start()
        );

        this.Canvas = document.querySelector("canvas")!;
        this.Canvas.width = window.innerWidth;
        this.Canvas.height = window.innerHeight;
        this.Canvas.addEventListener("click", () => this.Canvas.requestPointerLock());

        window.addEventListener("keydown", evt => (this.Input[evt.code] = 1));
        window.addEventListener("keyup", evt => (this.Input[evt.code] = 0));
        this.Canvas.addEventListener("mousedown", evt => (this.Input[`mouse_${evt.button}`] = 1));
        this.Canvas.addEventListener("mouseup", evt => (this.Input[`mouse_${evt.button}`] = 0));
        this.Canvas.addEventListener("mousemove", evt => {
            this.Input.mouse_x = evt.movementX;
            this.Input.mouse_y = evt.movementY;
        });

        this.GL = this.Canvas.getContext("webgl2")!;
        this.GL.enable(this.GL.DEPTH_TEST);
        this.GL.enable(this.GL.CULL_FACE);
        this.GL.frontFace(this.GL.CW);

        this.Materials[Mat.Points] = mat_points(this.GL);
        this.Materials[Mat.Wireframe] = mat_wireframe(this.GL);
        this.Materials[Mat.Basic] = mat_basic(this.GL);
        this.Materials[Mat.Flat] = mat_flat(this.GL);
        this.Materials[Mat.Gouraud] = mat_gouraud(this.GL);
        this.Materials[Mat.Phong] = mat_phong(this.GL);
    }

    create_entity(mask: number) {
        for (let i = 0; i < MAX_ENTITIES; i++) {
            if (!this.World[i]) {
                this.World[i] = mask;
                return i;
            }
        }
        throw new Error("No more entities available.");
    }

    fixed_update(delta: number) {
        // Player input.
        sys_player_move(this, delta);
        // Game logic.
        sys_animate(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);
        sys_trigger(this, delta);
        // Collisions and physics.
        sys_collide(this, delta);
        sys_physics(this, delta);
        sys_transform(this, delta);
        // Debug.
        true && sys_debug(this, delta);
    }

    frame_update(delta: number) {
        sys_audio(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_framerate(this, delta);
        sys_ui(this, delta);
    }

    start() {
        let step = 1 / 60;
        let accumulator = 0;
        let last = performance.now();

        let tick = (now: number) => {
            let delta = (now - last) / 1000;
            accumulator += delta;

            // Scale down mouse input (collected every frame) to match the step.
            let fixed_updates_count = accumulator / step;
            this.Input.mouse_x /= fixed_updates_count;
            this.Input.mouse_y /= fixed_updates_count;

            while (accumulator > step) {
                accumulator -= step;
                this.fixed_update(step);
            }
            this.frame_update(delta);

            last = now;
            this.Input.mouse_x = 0;
            this.Input.mouse_y = 0;
            this.RAF = requestAnimationFrame(tick);
        };

        this.stop();
        this.Audio.resume();
        tick(last);
    }

    stop() {
        this.Audio.suspend();
        cancelAnimationFrame(this.RAF);
    }

    add({translation, rotation, scale, using = [], children = []}: Blueprint) {
        let entity = this.create_entity(Get.Transform);
        transform(translation, rotation, scale)(this)(entity);
        for (let mixin of using) {
            mixin(this)(entity);
        }
        let entity_transform = this[Get.Transform][entity];
        for (let subtree of children) {
            let child = this.add(subtree);
            let child_transform = this[Get.Transform][child];
            child_transform.Parent = entity_transform;
            entity_transform.Children.push(child_transform);
        }
        return entity;
    }

    destroy(entity: Entity) {
        let mask = this.World[entity];
        if (mask & Get.Transform) {
            for (let child of this[Get.Transform][entity].Children) {
                this.destroy(child.EntityId);
            }
        }
        this.World[entity] = 0;
    }
}
