import {Get} from "../components/com_index.js";
import {Entity, Game} from "../game.js";
import {get_translation, invert, multiply} from "../math/mat4.js";

const QUERY = (1 << Get.Transform) | (1 << Get.Camera);

export function sys_camera(game: Game, delta: number) {
    game.Cameras = [];
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game[Get.Transform][entity];
    let camera = game[Get.Camera][entity];
    game.Cameras.push(camera);
    get_translation(camera.Position, transform.World);
    invert(camera.View, transform.World);
    multiply(camera.PV, camera.Projection, camera.View);
}
