import {Camera} from "../components/com_camera.js";
import {CAMERA, TRANSFORM} from "../components/com_index.js";
import {Transform} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {get_translation, invert, multiply} from "../math/mat4.js";

const QUERY = TRANSFORM | CAMERA;

export function sys_camera(game: Game, delta: number) {
    game.cameras = [];
    for (let i = 0; i < game.world.length; i++) {
        if ((game.world[i] & QUERY) === QUERY) {
            update(game, i);
        }
    }
}

function update(game: Game, entity: Entity) {
    let transform = game[TRANSFORM][entity] as Transform;
    let camera = game[CAMERA][entity] as Camera;
    game.cameras.push(camera);
    get_translation(camera.position, transform.world);
    invert(camera.view, transform.world);
    multiply(camera.pv, camera.projection, camera.view);
}
