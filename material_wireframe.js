import create_basic from "./material_basic.js";

export default
function create_wireframe(gl) {
    return {
        ...create_basic(gl),
        mode: gl.LINE_LOOP,
    };
}
