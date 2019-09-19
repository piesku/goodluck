import {GameState} from "./actions.js";
import {Blueprint} from "./blueprints/blu_common.js";
import {Animate} from "./components/com_animate.js";
import {AudioSource} from "./components/com_audio_source.js";
import {Camera} from "./components/com_camera.js";
import {Collide} from "./components/com_collide.js";
import {ComponentData, Get} from "./components/com_index.js";
import {Lifespan} from "./components/com_lifespan.js";
import {Light} from "./components/com_light.js";
import {Mimic} from "./components/com_mimic.js";
import {Move} from "./components/com_move.js";
import {Named} from "./components/com_named.js";
import {PlayerControl} from "./components/com_player_control.js";
import {Render} from "./components/com_render.js";
import {RigidBody} from "./components/com_rigid_body.js";
import {Shake} from "./components/com_shake.js";
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
import {Vec4} from "./math/index.js";
import {sys_animate} from "./systems/sys_animate.js";
import {sys_audio} from "./systems/sys_audio.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_collide} from "./systems/sys_collide.js";
import {sys_control_player} from "./systems/sys_control_player.js";
import {sys_debug} from "./systems/sys_debug.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_lifespan} from "./systems/sys_lifespan.js";
import {sys_light} from "./systems/sys_light.js";
import {sys_mimic} from "./systems/sys_mimic.js";
import {sys_move} from "./systems/sys_move.js";
import {sys_performance} from "./systems/sys_performance.js";
import {sys_physics} from "./systems/sys_physics.js";
import {sys_render} from "./systems/sys_render.js";
import {sys_shake} from "./systems/sys_shake.js";
import {sys_transform} from "./systems/sys_transform.js";
import {sys_trigger} from "./systems/sys_trigger.js";
import {sys_ui} from "./systems/sys_ui.js";
import {GL_CULL_FACE, GL_CW, GL_DEPTH_TEST} from "./webgl.js";

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

export class Game implements ComponentData, GameState {
    public World: Array<number> = [];

    // Implement ComponentData
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
    public [Get.Mimic]: Array<Mimic> = [];
    public [Get.Lifespan]: Array<Lifespan> = [];
    public [Get.Shake]: Array<Shake> = [];

    public Canvas: HTMLCanvasElement;
    public GL: WebGL2RenderingContext;
    public Audio: AudioContext = new AudioContext();
    public InputState: InputState = {mouse_x: 0, mouse_y: 0};
    public InputEvent: InputEvent = {mouse_x: 0, mouse_y: 0, wheel_y: 0};

    // Implement GameState
    public ClearColor = <Vec4>[1, 0.3, 0.3, 1];

    public Materials: Array<Material> = [];
    public Cameras: Array<Camera> = [];
    public Lights: Array<Light> = [];
    private RAF: number = 0;

    constructor() {
        document.addEventListener("visibilitychange", () =>
            document.hidden ? this.Stop() : this.Start()
        );

        this.Canvas = document.querySelector("canvas")!;
        this.Canvas.width = window.innerWidth;
        this.Canvas.height = window.innerHeight;
        this.Canvas.addEventListener("click", () => this.Canvas.requestPointerLock());

        window.addEventListener("keydown", evt => (this.InputState[evt.code] = 1));
        window.addEventListener("keyup", evt => (this.InputState[evt.code] = 0));
        this.Canvas.addEventListener("contextmenu", evt => evt.preventDefault());
        this.Canvas.addEventListener("mousedown", evt => {
            this.InputState[`mouse_${evt.button}`] = 1;
            this.InputEvent[`mouse_${evt.button}_down`] = 1;
        });
        this.Canvas.addEventListener("mouseup", evt => {
            this.InputState[`mouse_${evt.button}`] = 0;
            this.InputEvent[`mouse_${evt.button}_up`] = 1;
        });
        this.Canvas.addEventListener("mousemove", evt => {
            this.InputState.mouse_x = evt.offsetX;
            this.InputState.mouse_y = evt.offsetY;
            this.InputEvent.mouse_x = evt.movementX;
            this.InputEvent.mouse_y = evt.movementY;
        });
        this.Canvas.addEventListener("wheel", evt => {
            this.InputEvent.wheel_y = evt.deltaY;
        });

        this.GL = this.Canvas.getContext("webgl2")!;
        this.GL.enable(GL_DEPTH_TEST);
        this.GL.enable(GL_CULL_FACE);
        this.GL.frontFace(GL_CW);

        this.Materials[Mat.Points] = mat_points(this.GL);
        this.Materials[Mat.Wireframe] = mat_wireframe(this.GL);
        this.Materials[Mat.Basic] = mat_basic(this.GL);
        this.Materials[Mat.Flat] = mat_flat(this.GL);
        this.Materials[Mat.Gouraud] = mat_gouraud(this.GL);
        this.Materials[Mat.Phong] = mat_phong(this.GL);
    }

    CreateEntity(mask: number = 0) {
        for (let i = 0; i < MAX_ENTITIES; i++) {
            if (!this.World[i]) {
                this.World[i] = mask;
                return i;
            }
        }
        throw new Error("No more entities available.");
    }

    FixedUpdate(delta: number) {
        let now = performance.now();

        // Destroy entities past their age.
        sys_lifespan(this, delta);

        // Player input.
        sys_control_player(this, delta);

        // Animation and movement.
        sys_mimic(this, delta);
        sys_shake(this, delta);
        sys_animate(this, delta);
        sys_move(this, delta);
        sys_transform(this, delta);

        // Collisions and physics.
        sys_collide(this, delta);
        sys_physics(this, delta);
        sys_transform(this, delta);

        // Post-transform systems.
        sys_trigger(this, delta);

        // Performance.
        sys_performance(this, performance.now() - now, document.querySelector("#fixed"));

        // Debug.
        true && sys_debug(this, delta);

        for (let name in this.InputEvent) {
            this.InputEvent[name] = 0;
        }
    }

    FrameUpdate(delta: number) {
        let now = performance.now();

        sys_audio(this, delta);
        sys_camera(this, delta);
        sys_light(this, delta);
        sys_render(this, delta);
        sys_framerate(this, delta);
        sys_ui(this, delta);

        // Performance.
        sys_performance(this, performance.now() - now, document.querySelector("#frame"));
    }

    Start() {
        let step = 1 / 60;
        let accumulator = 0;
        let last = performance.now();

        let tick = (now: number) => {
            let delta = (now - last) / 1000;
            accumulator += delta;

            // Scale down mouse input (collected every frame) to match the step.
            let fixed_updates_count = accumulator / step;
            this.InputState.mouse_x /= fixed_updates_count;
            this.InputState.mouse_y /= fixed_updates_count;

            while (accumulator > step) {
                accumulator -= step;
                this.FixedUpdate(step);
            }
            this.FrameUpdate(delta);

            last = now;
            this.InputState.mouse_x = 0;
            this.InputState.mouse_y = 0;
            this.RAF = requestAnimationFrame(tick);
        };

        this.Stop();
        this.Audio.resume();
        tick(last);
    }

    Stop() {
        this.Audio.suspend();
        cancelAnimationFrame(this.RAF);
    }

    Add({Translation, Rotation, Scale, Using = [], Children = []}: Blueprint) {
        let entity = this.CreateEntity();
        transform(Translation, Rotation, Scale)(this, entity);
        for (let mixin of Using) {
            mixin(this, entity);
        }
        let entity_transform = this[Get.Transform][entity];
        for (let subtree of Children) {
            let child = this.Add(subtree);
            let child_transform = this[Get.Transform][child];
            child_transform.Parent = entity_transform;
            entity_transform.Children.push(child_transform);
        }
        return entity;
    }

    Destroy(entity: Entity) {
        let mask = this.World[entity];
        if (mask & (1 << Get.Transform)) {
            for (let child of this[Get.Transform][entity].Children) {
                this.Destroy(child.EntityId);
            }
        }
        this.World[entity] = 0;
    }
}
