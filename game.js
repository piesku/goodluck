import * as mat4 from "./gl-matrix/mat4.js";
import create_context from "./context.js";

import * as COMPONENT from "./components.js";
import render_tick from "./system_render.js";
import rotate_tick from "./system_rotate.js";
import framerate_tick from "./system_framerate.js";

const COMPONENT_NONE = 0;
const MAX_ENTITIES = 10000;

export default
class Game {
    constructor({selector, ...options}) {
        Object.assign(this, options, create_context(selector));
        this.entities = new Uint32Array(MAX_ENTITIES);

        this.components = [];
        this.components[COMPONENT.TRANSFORM] = [];
        this.components[COMPONENT.RENDER] = [];
        this.components[COMPONENT.ROTATE] = [];

        this.projection = mat4.create();
        mat4.perspective(this.projection, 1,
                this.canvas.width / this.canvas.height, 0.1, 1000);
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
