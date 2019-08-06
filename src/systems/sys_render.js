import * as mat4 from "../gl-matrix/mat4.js";
import {TRANSFORM, RENDER, LIGHT, CAMERA} from "../components/com_index.js";

const MASK = TRANSFORM | RENDER;

// TODO Support more than one camera.
let pv = mat4.create();

export default
function tick(game, delta) {
    let {entities, components} = game;

    let projection = game.components[CAMERA][game.camera];
    let view = mat4.create();
    mat4.invert(view, game.components[TRANSFORM][game.camera].model);
    mat4.multiply(pv, projection, view);

    let lights_count = 0;
    let lights_positions = [];
    let lights_details = [];

    for (let i = 0; i < entities.length; i++) {
        if ((entities[i] & LIGHT) === LIGHT) {
            lights_count++;
            let position = components[TRANSFORM][i].translation;
            lights_positions.push(...position);
            let light = components[LIGHT][i];
            lights_details.push(...light.color, light.intensity);
        }
    }

    let lights = {
        count: lights_count,
        positions: new Float32Array(lights_positions),
        details: new Float32Array(lights_details),
    };

    for (let i = 0; i < entities.length; i++) {
        if ((entities[i] & MASK) === MASK) {
            let transform = components[TRANSFORM][i];
            let render = components[RENDER][i];

            // TODO Sort by material.
            render.material.use(pv, lights);
            render.material.draw(transform.model, render);
        }
    }
}
