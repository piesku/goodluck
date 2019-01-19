import create_basic from "./material_basic.js";

export default
function WireframeMaterial(gl) {
    return {
        ...create_basic(gl),
        mode: gl.LINE_LOOP,
    };
}
