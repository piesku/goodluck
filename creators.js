import * as mat4 from "./gl-matrix/mat4.js";
import * as quat from "./gl-matrix/quat.js";
import {TRANSFORM, RENDER, ROTATE, SWARM, LIGHT, CAMERA, MOVE}
        from "./components.js";
import Transform from "./component_transform.js";
import Move from "./component_move.js";

export
function camera(game, {translation, fovy, aspect, near, far}) {
    let entity = game.create_entity(TRANSFORM | CAMERA | MOVE);
    game.components[TRANSFORM][entity] =
        new Transform(translation, [0, 0, 0, 1]);
    game.components[CAMERA][entity] =
        // Create the projection matrix.
        mat4.perspective(mat4.create(), fovy, aspect, near, far);
    game.components[MOVE][entity] = new Move();
    return entity;
}

export
function renderable(game, shape, material,
        {translation, rotation, scale, color}) {
    let entity = game.create_entity(TRANSFORM | RENDER);
    game.components[TRANSFORM][entity] = new Transform(
        translation, rotation, scale);
    game.components[RENDER][entity] = material.bind(shape, color);
    return entity;
}

export
function lighting(game,
        {translation, color = [1, 1, 1], range = 1}) {
    let entity = game.create_entity(TRANSFORM | LIGHT);
    game.components[TRANSFORM][entity] = new Transform(translation);
    let intensity = range * range;
    game.components[LIGHT][entity] = {color, intensity};
    return entity;
}

export
function rotating(game, shape, material,
        {translation, scale, color, speed = [0.1, 0.2, 0.3]}) {
    let entity = renderable(game, shape, material, {translation, scale, color});
    game.entities[entity] |= ROTATE;
    let rotate = quat.create();
    game.components[ROTATE][entity] = quat.fromEuler(rotate, ...speed);
    return entity;
}

export
function movable(game, shape, material,
        {translation, scale, color}) {
    let entity = renderable(game, shape, material, {translation, scale, color});
    game.entities[entity] |= MOVE;
    game.components[MOVE][entity] = new Move();
    return entity;
}

export
function swarming(game, shape, material,
        {translation, rotation, scale, color, ...swarm}) {
    let entity = game.create_entity(TRANSFORM | RENDER | SWARM);
    game.components[TRANSFORM][entity] = new Transform(
        translation, rotation, scale);
    game.components[RENDER][entity] = material.bind(shape, color);
    game.components[SWARM][entity] = swarm;
    return entity;
}
