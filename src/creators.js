import * as mat4 from "./gl-matrix/mat4.js";
import * as quat from "./gl-matrix/quat.js";
import {TRANSFORM, RENDER, ROTATE, LIGHT, CAMERA}
        from "./components/com_index.js";
import Transform from "./components/com_transform.js";

export
function camera(game, {translation, fovy, aspect, near, far}) {
    let entity = game.create_entity(TRANSFORM | CAMERA);
    game.components[TRANSFORM][entity] =
        new Transform(translation, [0, 0, 0, 1]);
    game.components[CAMERA][entity] =
        // Create the projection matrix.
        mat4.perspective(mat4.create(), fovy, aspect, near, far);
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
