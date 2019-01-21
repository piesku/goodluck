import * as mat4 from "./gl-matrix/mat4.js";
import {TRANSFORM, RENDER, SWARM, LIGHT} from "./components.js";

const MASK = TRANSFORM | RENDER;

let view = mat4.create();
mat4.translate(view, view, [0, 0, 10]);
mat4.invert(view, view);

let pv = mat4.create();

export default
function tick(game, delta) {
    let {entities, components} = game;
    mat4.multiply(pv, game.projection, view);

    let lights_count = components[LIGHT].size;
    let lights = {
        count: lights_count,
        positions: new Float32Array(lights_count * 3),
        colors: new Float32Array(lights_count * 3),
        ranges: new Float32Array(lights_count),
    };

    let i = 0;
    for (let [entity, light] of components[LIGHT]) {
        let light_position = components[TRANSFORM][entity].slice(12, 15);
        lights.positions.set(light_position, i * 3);
        lights.colors.set(light.color, i * 3);
        lights.ranges[i++] = light.range;
    }

    for (let i = 0; i < entities.length; i++) {
        if ((entities[i] & MASK) === MASK) {
            let model = components[TRANSFORM][i];
            let render = components[RENDER][i];
            let swarm = components[SWARM][i];

            // TODO Sort by material.
            render.material.use(pv, lights);
            render.material.draw(model, render, swarm);
        }
    }
}
