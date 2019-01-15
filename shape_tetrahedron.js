import * as mat4 from "./gl-matrix/mat4.js";
import {COMPONENT_RENDER, COMPONENT_TRANSFORM} from "./components.js";

let tetrahedron = [
    [1.0, 1.0, 1.0],
    [-1.0, 1.0, -1.0],
    [1.0, -1.0, -1.0],
    [-1.0, -1.0, 1.0],
];

let vertices = Float32Array.from([
    ...tetrahedron[0], ...tetrahedron[1], ...tetrahedron[2],
    ...tetrahedron[1], ...tetrahedron[3], ...tetrahedron[2],
    ...tetrahedron[0], ...tetrahedron[3], ...tetrahedron[1],
    ...tetrahedron[0], ...tetrahedron[2], ...tetrahedron[3],
]);

export default
function create_tetrahedron(game, material, color) {
    let entity = game.create_entity(
            COMPONENT_TRANSFORM | COMPONENT_RENDER);
    game.components.render[entity] = {vertices, material, color};
    game.components.transform[entity] = mat4.create();
    return entity;
}
