/**
 * # AudioListener
 *
 * The [transform](com_transform.html) of the entity with the `AudioListener`
 * component will be used to set the position and orientation of `game.Audio`'s
 * listener.
 */

import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

/**
 * Add `AudioListener` to an entity.
 *
 * This component has no data; only the bitflag.
 */
export function audio_listener() {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.AudioListener;
    };
}
