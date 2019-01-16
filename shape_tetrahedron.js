import * as mat4 from "./gl-matrix/mat4.js";
import {COMPONENT_RENDER, COMPONENT_TRANSFORM} from "./components.js";
import {create_render} from "./system_render.js";
import {range} from "./number.js";

let vertex_array = Float32Array.from([
    1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1,
    -1, 1, -1, 1, -1, -1, -1, 1, -1, -1, -1, 1, 1, 1, 1
]);

let index_array = Uint16Array.from(range(0, 12));

let normals = [
    0.5774, 0.5774, -0.5774, 0.5774, 0.5774, -0.5774, 0.5774, 0.5774, -0.5774,
      0.5774, -0.5774, 0.5774, 0.5774, -0.5774, 0.5774, 0.5774, -0.5774,
    0.5774, -0.5774, -0.5774, -0.5774, -0.5774, -0.5774, -0.5774, -0.5774,
    -0.5774, -0.5774, -0.5774, 0.5774, 0.5774, -0.5774, 0.5774, 0.5774,
    -0.5774, 0.5774, 0.5774
];

export default
function create_tetrahedron(game, material, color) {
    let entity = game.create_entity(
            COMPONENT_TRANSFORM | COMPONENT_RENDER);
    game.components.transform[entity] = mat4.create();
    game.components.render[entity] = create_render(
            game.gl, vertex_array, index_array, material, color);
    return entity;
}
