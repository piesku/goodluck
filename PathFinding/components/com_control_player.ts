import {Entity, Game} from "../game.js";

export function control_player() {
    return (game: Game, entity: Entity) => {
        //game.World.Mask[entity] |= Has.ControlPlayer;
    };
}
