import {Entity, Game} from "../game.js";
import {Mat4, Vec3} from "../math/index.js";
import {create, perspective} from "../math/mat4.js";
import {Get} from "./com_index.js";

export interface Camera {
    Position: Vec3;
    Projection: Mat4;
    View: Mat4;
    PV: Mat4;
}

export function camera(aspect: number, fovy: number, near: number, far: number) {
    return (game: Game) => (entity: Entity) => {
        game.World[entity] |= 1 << Get.Camera;
        game[Get.Camera][entity] = <Camera>{
            Position: [],
            Projection: perspective(create(), fovy, aspect, near, far),
            View: create(),
            PV: create(),
        };
    };
}
