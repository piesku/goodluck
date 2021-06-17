/**
 * @module components/com_disable
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";

export function disable(mask: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] &= ~mask;
    };
}
