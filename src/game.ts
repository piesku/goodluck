import {Camera} from "./components/com_camera.js";
import {Component, TRANSFORM} from "./components/com_index.js";
import {Transform, transform} from "./components/com_transform.js";
import {Material} from "./materials/mat_common.js";
import {mat_wireframe} from "./materials/mat_wireframe.js";
import {Quat, Vec3, Vec4} from "./math/index.js";
import {sys_camera} from "./systems/sys_camera.js";
import {sys_framerate} from "./systems/sys_framerate.js";
import {sys_render} from "./systems/sys_render.js";
import sys_rotate from "./systems/sys_rotate.js";
import {sys_transform} from "./systems/sys_transform.js";

const MAX_ENTITIES = 10000;
const COMPONENT_COUNT = 32;
const COMPONENT_NONE = 0;

export type Entity = number;

export interface Input {
    [k: string]: number;
    mouse_x: number;
    mouse_y: number;
}

type Mixin = (game: Game) => (entity: Entity) => void;

export interface Blueprint {
    translation?: Vec3;
    rotation?: Quat;
    scale?: Vec3;
    using?: Array<Mixin>;
    children?: Array<Blueprint>;
}

export class Game extends Array<Array<Component>> {
    public world: Array<number>;
    public canvas: HTMLCanvasElement;
    public gl: WebGL2RenderingContext;
    public input: Input = {mouse_x: 0, mouse_y: 0};
    public fog_color: Vec4 = [0, 0, 0, 1];
    public materials: Array<Material>;
    public cameras: Array<Camera>;
    private raf: number = 0;

    constructor() {
        super();
        this.world = [];
        for (let i = 0; i < COMPONENT_COUNT; i++) {
            this[2 ** i] = [];
        }

        document.addEventListener("visibilitychange", () =>
            document.hidden ? this.stop() : this.start()
        );

        this.canvas = document.querySelector("canvas")!;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.addEventListener("click", () => this.canvas.requestPointerLock());

        window.addEventListener("keydown", evt => (this.input[evt.code] = 1));
        window.addEventListener("keyup", evt => (this.input[evt.code] = 0));
        this.canvas.addEventListener("mousedown", evt => (this.input[`mouse_${evt.button}`] = 1));
        this.canvas.addEventListener("mouseup", evt => (this.input[`mouse_${evt.button}`] = 0));
        this.canvas.addEventListener("mousemove", evt => {
            this.input.mouse_x = evt.movementX;
            this.input.mouse_y = evt.movementY;
        });

        this.gl = this.canvas.getContext("webgl2")!;
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.frontFace(this.gl.CW);

        this.cameras = [];
        this.materials = [mat_wireframe(this.gl)];
    }

    create_entity(mask: number) {
        for (let i = 0; i < MAX_ENTITIES; i++) {
            if (!this.world[i]) {
                this.world[i] = mask;
                return i;
            }
        }
        throw new Error("No more entities available.");
    }

    fixed_update(delta: number) {
        sys_rotate(this, delta);
        sys_transform(this, delta);
    }

    frame_update(delta: number) {
        sys_camera(this, delta);
        sys_render(this, delta);
        sys_framerate(this, delta);
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
            this.input.mouse_x /= fixed_updates_count;
            this.input.mouse_y /= fixed_updates_count;

            while (accumulator > step) {
                accumulator -= step;
                this.fixed_update(step);
            }
            this.frame_update(delta);

            last = now;
            this.input.mouse_x = 0;
            this.input.mouse_y = 0;
            this.raf = requestAnimationFrame(tick);
        };

        this.stop();
        tick(last);
    }

    stop() {
        cancelAnimationFrame(this.raf);
    }

    add({translation, rotation, scale, using = [], children = []}: Blueprint) {
        let entity = this.create_entity(TRANSFORM);
        transform(translation, rotation, scale)(this)(entity);
        for (let mixin of using) {
            mixin(this)(entity);
        }
        let entity_transform = this[TRANSFORM][entity] as Transform;
        for (let subtree of children) {
            let child = this.add(subtree);
            let child_transform = this[TRANSFORM][child] as Transform;
            child_transform.parent = entity_transform;
            entity_transform.children.push(child_transform);
        }
        return entity;
    }

    destroy(entity: Entity) {
        let mask = this.world[entity];
        if (mask & TRANSFORM) {
            for (let child of (this[TRANSFORM][entity] as Transform).children) {
                this.destroy(child.entity);
            }
        }
        this.world[entity] = COMPONENT_NONE;
    }
}
