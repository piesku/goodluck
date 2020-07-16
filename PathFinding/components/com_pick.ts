import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export function pick() {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Pick;
    };
}
