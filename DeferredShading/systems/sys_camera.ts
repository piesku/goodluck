import {copy, get_translation, invert, multiply, perspective} from "../../common/mat4.js";
import {CameraFramebuffer, CameraKind} from "../components/com_camera.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    game.Cameras = [];
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let camera = game.World.Camera[i];

            if (camera.Kind === CameraKind.Framebuffer) {
                update_framebuffer(game, i, camera);
                game.Cameras.push(camera);
            }
        }
    }
}

function update_framebuffer(game: Game, entity: Entity, camera: CameraFramebuffer) {
    if (game.ViewportResized) {
        let aspect = camera.Target.Width / camera.Target.Height;
        if (aspect > 1) {
            // Landscape orientation.
            perspective(camera.Projection, camera.FovY, aspect, camera.Near, camera.Far);
            invert(camera.Unprojection, camera.Projection);
        } else {
            // Portrait orientation.
            perspective(camera.Projection, camera.FovY / aspect, aspect, camera.Near, camera.Far);
            invert(camera.Unprojection, camera.Projection);
        }
    }

    let transform = game.World.Transform[entity];
    get_translation(camera.Position, transform.World);
    copy(camera.View, transform.Self);
    multiply(camera.Pv, camera.Projection, camera.View);
}
