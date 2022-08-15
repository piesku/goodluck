/**
 * # sys_render2d_animate
 *
 * Animate sprites (WIP).
 */

import {Entity} from "../../lib/world.js";
import {set_sprite} from "../components/com_render2d.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.AnimateSprite | Has.Render2D;

export function sys_render2d_animate(game: Game, delta: number) {
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let animate = game.World.AnimateSprite[entity];

    for (let frame_name in animate.Frames) {
        let frame_timestamp = animate.Frames[frame_name];
        if (animate.Time < frame_timestamp) {
            set_sprite(game, entity, frame_name);
            break;
        }
    }

    animate.Time += delta;
    if (animate.Time >= animate.Duration) {
        animate.Time -= animate.Duration;
    }
}
