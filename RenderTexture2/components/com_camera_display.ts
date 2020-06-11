import {create} from "../../common/mat4.js";
import {Mat4, Vec4} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";
import {CameraKind} from "./com_camera.js";

export interface CameraDisplay {
    Kind: CameraKind.Display;
    FovY: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    Pv: Mat4;
    ClearColor: Vec4;
}
export function camera_display(fovy: number, near: number, far: number, clear_color: Vec4) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Display,
            FovY: fovy,
            Near: near,
            Far: far,
            Projection: create(),
            Pv: create(),
            ClearColor: clear_color,
        };
    };
}
