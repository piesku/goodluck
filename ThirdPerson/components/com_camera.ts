import {create} from "../../common/mat4.js";
import {Mat4} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export interface Camera {
    FOVy: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    View: Mat4;
    PV: Mat4;
}

export function camera(fovy: number, near: number, far: number) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Camera;
        game.World.Camera[entity] = <Camera>{
            FOVy: fovy,
            Near: near,
            Far: far,
            Projection: create(),
            View: create(),
            PV: create(),
        };
    };
}
