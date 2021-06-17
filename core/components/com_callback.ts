/**
 * @module components/com_callback
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";

type Callback = (game: Game, entity: Entity) => void;

export function callback(fn: Callback) {
    return (game: Game, entity: Entity) => {
        fn(game, entity);
    };
}
