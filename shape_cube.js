import * as mat4 from "./gl-matrix/mat4.js";
import {COMPONENT_RENDER, COMPONENT_TRANSFORM} from "./components.js";

let cube = [
    [0.5, 0.5, 0.5],
    [0.5, 0.5, -0.5],
    [0.5, -0.5, 0.5],
    [0.5, -0.5, -0.5],
    [-0.5, 0.5, 0.5],
    [-0.5, 0.5, -0.5],
    [-0.5, -0.5, 0.5],
    [-0.5, -0.5, -0.5],
];

let vertices = Float32Array.from([
    ...cube[0], ...cube[1], ...cube[2], ...cube[3],
    ...cube[5], ...cube[4], ...cube[7], ...cube[6],
    ...cube[5], ...cube[1], ...cube[4], ...cube[0],
    ...cube[6], ...cube[2], ...cube[7], ...cube[3],
    ...cube[4], ...cube[0], ...cube[6], ...cube[2],
    ...cube[1], ...cube[5], ...cube[3], ...cube[7],
]);

let indices = Uint16Array.from([
    0, 2, 1,
    2, 3, 1,
    4, 6, 5,
    6, 7, 5,
    8, 10, 9,
    10, 11, 9,
    12, 14, 13,
    14, 15, 13,
    16, 18, 17,
    18, 19, 17,
    20, 22, 21,
    22, 23, 21
]);

let normals = [
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1
];

export default
function create_cube(game, material, color) {
    let entity = game.create_entity(
            COMPONENT_TRANSFORM | COMPONENT_RENDER);
    game.components.render[entity] = {vertices, indices, material, color};
    game.components.transform[entity] = mat4.create();
    return entity;
}
