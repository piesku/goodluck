import * as mat4 from "./gl-matrix/mat4.js";
import {TRANSFORM, RENDER, ROTATE, SWARM} from "./components.js";

export
function renderable(game, shape, material, {color, scale = [1, 1, 1]}) {
    let entity = game.create_entity(TRANSFORM | RENDER);
    let model = mat4.create();
    game.components[TRANSFORM][entity] = mat4.scale(model, model, scale);
    game.components[RENDER][entity] = {
        vao: material.create_vao(shape),
        count: shape.indices.length,
        material, color
    };
    return entity;
}

export
function rotating(game, shape, material,
        {color, scale = [1, 1, 1], rotation = [0.1, 0.2, 0.3]}) {
    let entity = renderable(game, shape, material, {color, scale});
    game.entities[entity] |= ROTATE;
    game.components[ROTATE][entity] = rotation;
    return entity;
}

export
function swarming(game, shape, material, {color, ...swarm}) {
    let entity = game.create_entity(TRANSFORM | RENDER | SWARM);
    game.components[TRANSFORM][entity] = mat4.create();
    game.components[RENDER][entity] = {
        vao: material.create_vao(shape),
        count: shape.indices.length,
        material, color,
    };
    game.components[SWARM][entity] = swarm;
    return entity;
}
