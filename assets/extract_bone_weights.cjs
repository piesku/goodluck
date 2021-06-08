let file = require("./ludek.json");
let mesh = file.meshes[0];

let vertex_count = mesh.vertices.length / 3;
let weights_by_vertex = new Map();

for (let [index, bone] of mesh.bones.entries()) {
    for (let [vertex_index, weight] of bone.weights) {
        if (!weights_by_vertex.has(vertex_index)) {
            weights_by_vertex.set(vertex_index, []);
        }
        let vertex_weights = weights_by_vertex.get(vertex_index);
        vertex_weights.push(index, round(weight));
    }
}

let buffer = new Float32Array(vertex_count * 4);

for (let [vertex_index, vertex_weights] of weights_by_vertex) {
    if (vertex_weights.length > 4) {
        throw new Error("Too many weights for vertex id " + vertex_index);
    }

    buffer.set(vertex_weights, vertex_index * 4);
}

console.log(buffer.toString());

function round(num) {
    return Math.round(num * 100) / 100;
}
