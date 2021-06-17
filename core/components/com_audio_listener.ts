/**
 * @module components/com_audio_listener
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export function audio_listener() {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.AudioListener;
    };
}
