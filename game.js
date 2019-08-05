import create_context from "./context.js";

import render_tick from "./systems/sys_render.js";
import rotate_tick from "./systems/sys_rotate.js";
import framerate_tick from "./systems/sys_framerate.js";

const MAX_ENTITIES = 10000;
const COMPONENT_COUNT = 32;
const COMPONENT_NONE = 0;

export default
class Game {
    constructor({selector, ...options}) {
        Object.assign(this, options, create_context(selector));
        this.entities = new Uint32Array(MAX_ENTITIES);

        this.components = [];
        for (let i = 0; i < COMPONENT_COUNT; i++) {
            this.components[2 ** i] = [];
        }

        this.input = {};
        window.addEventListener("keydown",
                evt => this.input[evt.code] = true);
        window.addEventListener("keyup",
                evt => this.input[evt.code] = false);
    }

    create_entity(mask) {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i] === COMPONENT_NONE) {
                this.entities[i] = mask;
                return i;
            }
        }
        throw new Error("No more entities available.");
    }

    destroy_entity(entity) {
        this.entities[entity] = COMPONENT_NONE;
    }

    fixed_update(delta) {
        rotate_tick(this, delta);
    }

    frame_update(delta) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        render_tick(this, delta);
        framerate_tick(this, delta);
    }

    start() {
        let step = 1/60;
        let accumulator = 0;
        let last = performance.now();

        let tick = now => {
            let delta = (now - last) / 1000;
            accumulator += delta;
            while (accumulator > step) {
                accumulator -= step;
                this.fixed_update(step);
            }

            this.frame_update(delta);
            last = now;

            requestAnimationFrame(tick);
        }

        tick(last);
    }
}
