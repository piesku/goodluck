import {multiply, perspective} from "../../common/mat4.js";
import {CameraKind} from "../components/com_camera.js";
import {CameraDisplay} from "../components/com_camera_display.js";
import {CameraFramebuffer} from "../components/com_camera_framebuffer.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    if (game.ViewportWidth != window.innerWidth || game.ViewportHeight != window.innerHeight) {
        game.ViewportWidth = game.Canvas.width = window.innerWidth;
        game.ViewportHeight = game.Canvas.height = window.innerHeight;
        game.ViewportResized = true;
    }

    game.Cameras = [];
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            let camera = game.World.Camera[i];

            if (camera.Kind === CameraKind.Display) {
                update_display(game, i, camera);
                game.Cameras.push(camera);
            }

            if (camera.Kind === CameraKind.Framebuffer) {
                update_framebuffer(game, i, camera);
                game.Cameras.push(camera);
            }
        }
    }
}

function update_display(game: Game, entity: Entity, camera: CameraDisplay) {
    if (game.ViewportResized) {
        let aspect = game.ViewportWidth / game.ViewportHeight;
        if (aspect > 1) {
            // Landscape orientation.
            perspective(camera.Projection, camera.FovY, aspect, camera.Near, camera.Far);
        } else {
            // Portrait orientation.
            perspective(camera.Projection, camera.FovY / aspect, aspect, camera.Near, camera.Far);
        }
    }

    let transform = game.World.Transform[entity];
    multiply(camera.Pv, camera.Projection, transform.Self);
}

function update_framebuffer(game: Game, entity: Entity, camera: CameraFramebuffer) {
    let transform = game.World.Transform[entity];
    multiply(camera.Pv, camera.Projection, transform.Self);
}
