import * as mat4 from "./gl-matrix/mat4.js";
import {TRANSFORM, RENDER, SWARM, LIGHT, CAMERA} from "./components.js";

const MASK = TRANSFORM | RENDER;

// TODO Support more than one camera.
let pv = mat4.create();

export default
function tick(game, delta) {
    let {entities, components} = game;

    let projection = game.components[CAMERA].get(game.camera);
    let view = mat4.create();
    mat4.invert(view, game.components[TRANSFORM][game.camera].model);
    mat4.multiply(pv, projection, view);

    let lights_count = components[LIGHT].size;
    let lights = {
        count: lights_count,
        positions: new Float32Array(lights_count * 3),
        details: new Float32Array(lights_count * 4),
    };

    let i = 0;
    for (let [entity, light] of components[LIGHT]) {
        let light_position = components[TRANSFORM][entity].translation;
        lights.positions.set(light_position, i * 3);
        lights.details.set([...light.color, light.intensity], i * 4);
        i++;
    }

    for (let i = 0; i < entities.length; i++) {
        if ((entities[i] & MASK) === MASK) {
            let transform = components[TRANSFORM][i];
            let render = components[RENDER][i];
            let swarm = components[SWARM][i];

            // TODO Sort by material.
            render.material.use(pv, lights);
            render.material.draw(transform.model, render, swarm);
        }
    }
}
