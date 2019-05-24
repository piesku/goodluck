import * as vec3 from "./gl-matrix/vec3.js";
import {TRANSFORM, MOVE} from "./components.js";

const MASK = TRANSFORM | MOVE;

export default
function tick({entities, components}, delta) {
    for (let i = 0; i < entities.length; i++) {
        if ((entities[i] & MASK) === MASK) {
            update(game.input, delta,
                    components[TRANSFORM][i], components[MOVE][i]);
        }
    }
}

function update(input, delta, transform, move) {
    let is_moving = false;
    let movement = [0, 0, 0];
    if (input.KeyW) {
        is_moving = true;
        movement[2] += 1;
    }
    if (input.KeyA) {
        is_moving = true;
        movement[0] += 1;
    }
    if (input.KeyS) {
        is_moving = true;
        movement[2] -= 1;
    }
    if (input.KeyD) {
        is_moving = true;
        movement[0] -= 1;
    }

    if (!is_moving) {
        return;
    }

    // Transform the movement vector into the world space.
    vec3.transformMat4(movement, movement, transform.model);

    // Make it 
    vec3.subtract(movement, movement, transform.translation);
    vec3.normalize(movement, movement);

    let distance = move.move_speed * delta;
    vec3.scale(movement, movement, distance);

    let translation = transform.translation;
    vec3.add(translation, translation, movement);
    transform.translation = translation;
}
