import * as mat4 from "./gl-matrix/mat4.js";
import {TRANSFORM, RENDER} from "./components.js";

export
function renderable(game, shape, material, color, scale = [1, 1, 1]) {
    let entity = game.create_entity(TRANSFORM | RENDER);

    let model = mat4.create();
    game.components[TRANSFORM][entity] = mat4.scale(model, model, scale);

    let vao = material.buffer(shape);
    game.components[RENDER][entity] =
        {vao, count: shape.indices.length, material, color};
    return entity;
}
