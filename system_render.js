import * as mat4 from "./gl-matrix/mat4.js";
import {TRANSFORM, RENDER, SWARM} from "./components.js";

const MASK = TRANSFORM | RENDER;

let view = mat4.create();
mat4.translate(view, view, [0, 0, 50]);
mat4.invert(view, view);

let pv = mat4.create();

export default
function tick(game, delta) {
    let {entities, components} = game;
    mat4.multiply(pv, game.projection, view);

    for (let i = 0; i < entities.length; i++) {
        if ((entities[i] & MASK) === MASK) {
            let model = components[TRANSFORM][i];
            let render = components[RENDER][i];
            let swarm = components[SWARM][i];

            // TODO Sort by material.
            render.material.use(pv);
            render.material.draw(model, render, swarm);
        }
    }
}
