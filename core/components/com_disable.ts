import {Entity, Game} from "../game";

export function disable(mask: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] &= ~mask;
    };
}
