import {Entity, Game} from "../game";

export function dra_exclamation(game: Game, entity: Entity) {
    game.Context2D.font = "10vmin sans";
    game.Context2D.textAlign = "center";
    game.Context2D.fillStyle = "#fff";
    game.Context2D.fillText("!", 0, 0);
}
