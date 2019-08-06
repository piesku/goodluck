import * as vec3 from "../gl-matrix/vec3.js";
import * as mat4 from "../gl-matrix/mat4.js";

export default
class Transform {
    constructor(translation, rotation, scale) {
        this.model = mat4.create();
        this._rotation = rotation || [0, 0, 0, 1];
        this._scale = scale || [1, 1, 1];
        this.translation = translation || [0, 0, 0];
    }

    get left() {
        let out = this.model.slice(0, 3);
        return vec3.normalize(out, out);
    }

    get up() {
        let out = this.model.slice(4, 7);
        return vec3.normalize(out, out);
    }

    get forward() {
        let out = this.model.slice(8, 11);
        return vec3.normalize(out, out);
    }

    set translation(vec) {
        mat4.fromRotationTranslationScale(
            this.model, this.rotation, vec, this.scale);
    }

    get translation() {
        return this.model.slice(12, 15);
    }

    set scale(vec) {
        this._scale = vec;
        mat4.fromRotationTranslationScale(
            this.model, this.rotation, this.translation, vec);
    }

    get scale() {
        return this._scale;
    }

    set rotation(quaternion) {
        this._rotation = quaternion;
        mat4.fromRotationTranslationScale(
            this.model, quaternion, this.translation, this.scale);
    }

    get rotation() {
        return this._rotation;
    }
}
