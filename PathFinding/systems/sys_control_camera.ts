import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.ControlCamera;
const INITIAL_CAMERA_Y = 100;

export function sys_control_camera(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let control = game.World.ControlCamera[entity];
    let transform = game.World.Transform[entity];

    if (control.Zoom) {
        game.CameraZoom = transform.Translation[1] / INITIAL_CAMERA_Y;
    }
}
