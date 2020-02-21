import {invert, multiply, perspective} from "../../common/mat4.js";
import {Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    if (game.ViewportWidth != window.innerWidth || game.ViewportHeight != window.innerHeight) {
        game.ViewportWidth = game.Canvas3D.width = window.innerWidth;
        game.ViewportHeight = game.Canvas3D.height = window.innerHeight;
        game.Resized = true;
    }

    game.Cameras = [];
    for (let i = 0; i < game.World.Mask.length; i++) {
        if ((game.World.Mask[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game.World.Transform[entity];
    let camera = game.World.Camera[entity];
    game.Cameras.push(camera);

    if (game.Resized) {
        let aspect = game.ViewportWidth / game.ViewportHeight;
        if (aspect > 1) {
            // Landscape orientation.
            perspective(camera.Projection, camera.FOVy, aspect, camera.Near, camera.Far);
        } else if (aspect > 0.4) {
            // Portrait orientation, up to the ultratall 9:21 aspect ratio.
            perspective(camera.Projection, camera.FOVy / aspect, aspect, camera.Near, camera.Far);
        } else {
            perspective(camera.Projection, camera.FOVy / 0.4, aspect, camera.Near, camera.Far);
        }
    }

    invert(camera.View, transform.World);
    multiply(camera.PV, camera.Projection, camera.View);
}
