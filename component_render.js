export default
function create_render(shape, material, color) {
    let vao = material.buffer(shape);
    return {vao, count: shape.indices.length, material, color};
}
