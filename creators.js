import * as mat4 from "./gl-matrix/mat4.js";
import {TRANSFORM, RENDER, ROTATE, SWARM, LIGHT} from "./components.js";

const QUAT_IDENTITY = new Float32Array([0, 0, 0, 1]);

export
function renderable(game, shape, material,
        {position, rotation = QUAT_IDENTITY, scale = [1, 1, 1], color}) {
    let entity = game.create_entity(TRANSFORM | RENDER);
    let model = mat4.create();
    game.components[TRANSFORM][entity] = mat4.fromRotationTranslationScale(
        model, rotation, position, scale);
    game.components[RENDER][entity] = {
        vao: material.create_vao(shape),
        count: shape.indices.length,
        material, color
    };
    return entity;
}

export
function lighting(game,
        {position, color = [1, 1, 1], range = 1}) {
    let entity = game.create_entity(TRANSFORM | LIGHT);
    let model = mat4.create();
    game.components[TRANSFORM][entity] = mat4.translate(model, model, position);
    let intensity = range * range;
    game.components[LIGHT].set(entity, {color, intensity});
    return entity;
}

export
function rotating(game, shape, material,
        {position, scale, color, speed = [0.1, 0.2, 0.3]}) {
    let entity = renderable(game, shape, material, {position, scale, color});
    game.entities[entity] |= ROTATE;
    game.components[ROTATE][entity] = speed;
    return entity;
}

export
function swarming(game, shape, material,
        {position, rotation = QUAT_IDENTITY, color, ...swarm}) {
    let entity = game.create_entity(TRANSFORM | RENDER | SWARM);
    let model = mat4.create();
    game.components[TRANSFORM][entity] = mat4.fromRotationTranslationScale(
        model, rotation, position, scale);
    game.components[RENDER][entity] = {
        vao: material.create_vao(shape),
        count: shape.indices.length,
        material, color,
    };
    game.components[SWARM][entity] = swarm;
    return entity;
}
