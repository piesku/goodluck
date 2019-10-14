import {Entity, Game} from "../game.js";
import {Mat4} from "../math/index.js";
import {create, perspective} from "../math/mat4.js";
import {Get, Has} from "./com_index.js";

export interface Camera {
    Projection: Mat4;
    View: Mat4;
    PV: Mat4;
}

export function camera(aspect: number, fovy: number, near: number, far: number) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.Camera;
        game[Get.Camera][entity] = <Camera>{
            Projection: perspective(create(), fovy, aspect, near, far),
            View: create(),
            PV: create(),
        };
    };
}
