import * as mat4 from "./gl-matrix/mat4.js";
import {COMPONENT_RENDER, COMPONENT_TRANSFORM} from "./components.js";

let tetrahedron = [
    [1.0, 1.0, 1.0],
    [-1.0, 1.0, -1.0],
    [1.0, -1.0, -1.0],
    [-1.0, -1.0, 1.0],
];

let vertices = Float32Array.from([
    ...tetrahedron[0], 0.3, 1.0, 1.0, 1.0, // cyan
    ...tetrahedron[1], 0.3, 1.0, 1.0, 1.0, // cyan
    ...tetrahedron[2], 0.3, 1.0, 1.0, 1.0, // cyan

    ...tetrahedron[1], 0.3, 1.0, 0.3, 1.0, // green
    ...tetrahedron[3], 0.3, 1.0, 0.3, 1.0, // green
    ...tetrahedron[2], 0.3, 1.0, 0.3, 1.0, // green

    ...tetrahedron[0], 0.3, 0.3, 1.0, 1.0, // blue
    ...tetrahedron[3], 0.3, 0.3, 1.0, 1.0, // blue
    ...tetrahedron[1], 0.3, 0.3, 1.0, 1.0, // blue

    ...tetrahedron[0], 1.0, 1.0, 0.3, 1.0, // yellow
    ...tetrahedron[2], 1.0, 1.0, 0.3, 1.0, // yellow
    ...tetrahedron[3], 1.0, 1.0, 0.3, 1.0, // yellow
]);

export default
function create_tetrahedron(game, material) {
    let entity = game.create_entity(
            COMPONENT_TRANSFORM | COMPONENT_RENDER);
    game.components.render[entity] = {vertices, material};
    game.components.transform[entity] = mat4.create();
    return entity;
}
