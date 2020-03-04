import {create, perspective} from "../../common/mat4.js";
import {Mat4} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export interface Camera {
    Projection: Mat4;
    View: Mat4;
    PV: Mat4;
}

export function camera(aspect: number, fovy: number, near: number, far: number) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Projection: perspective(create(), fovy, aspect, near, far),
            View: create(),
            PV: create(),
        };
    };
}
