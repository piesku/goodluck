import {Forward1Target} from "../../common/framebuffer.js";
import {create, invert, perspective} from "../../common/mat4.js";
import {Mat4, Vec3, Vec4} from "../../common/math.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export type Camera = CameraDisplay | CameraFramebuffer;
export const enum CameraKind {
    Display,
    Framebuffer,
}

export interface CameraEye {
    View: Mat4;
    Pv: Mat4;
    Position: Vec3;
}

export interface CameraDisplay extends CameraEye {
    Kind: CameraKind.Display;
    FovY: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    Unprojection: Mat4;
    ClearColor: Vec4;
}

export function camera_display_perspective(
    fovy: number,
    near: number,
    far: number,
    clear_color: Vec4 = [0.9, 0.9, 0.9, 1]
) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Display,
            FovY: fovy,
            Near: near,
            Far: far,
            View: create(),
            Projection: create(),
            Unprojection: create(),
            Pv: create(),
            Position: [0, 0, 0],
            ClearColor: clear_color,
        };
    };
}

interface GameGl extends Game {
    Gl: WebGLRenderingContext;
}

export interface CameraFramebuffer extends CameraEye {
    Kind: CameraKind.Framebuffer;
    Target: Forward1Target;
    FovY: number;
    Near: number;
    Far: number;
    Projection: Mat4;
    Unprojection: Mat4;
    ClearColor: Vec4;
}

export function camera_framebuffer_perspective(
    fovy: number,
    near: number,
    far: number,
    target: Forward1Target,
    clear_color: Vec4
) {
    return (game: GameGl, entity: Entity) => {
        let projection = create();
        perspective(projection, fovy, 1, near, far);
        let unprojection = create();
        invert(unprojection, projection);

        game.World.Signature[entity] |= Has.Camera;
        game.World.Camera[entity] = {
            Kind: CameraKind.Framebuffer,
            Target: target,
            FovY: fovy,
            Near: near,
            Far: far,
            View: projection,
            Projection: projection,
            Unprojection: unprojection,
            Pv: create(),
            Position: [0, 0, 0],
            ClearColor: clear_color,
        };
    };
}
