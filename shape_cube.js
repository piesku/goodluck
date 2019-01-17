import * as mat4 from "./gl-matrix/mat4.js";
import {RENDER, TRANSFORM} from "./components.js";
import create_render from "./component_render.js";

let vertices = Float32Array.from([
    -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
    0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5,
    0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
    0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5,
    0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5,
    -0.5, 0.5, 0.5, -0.5, 0.5
]);

let indices = Uint16Array.from([
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
    14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
]);

let normals = Float32Array.from([
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1
]);

export default
function create_cube(game, material, color) {
    let entity = game.create_entity(TRANSFORM | RENDER);
    game.components[TRANSFORM][entity] = mat4.create();
    game.components[RENDER][entity] = create_render(
            {vertices, indices, normals}, material, color);
    return entity;
}
