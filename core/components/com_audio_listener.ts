import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export function audio_listener() {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.AudioListener;
    };
}
