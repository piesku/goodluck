/**
 * # Callback
 *
 * A utility mixin which runs arbitrary logic when an entity is created.
 */

import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";

type Callback = (game: Game, entity: Entity) => void;

/**
 * Run arbitrary logic when an entity is created.
 *
 * @param fn The callback to run on the created entity.
 */
export function callback(fn: Callback) {
    return (game: Game, entity: Entity) => {
        fn(game, entity);
    };
}
