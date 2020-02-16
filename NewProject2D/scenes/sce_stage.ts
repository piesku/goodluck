import {draw_rect} from "../components/com_draw.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();

    instantiate(game, {
        Translation: [game.ViewportWidth / 2, game.ViewportHeight / 2],
        Using: [draw_rect(200, 100, "red")],
    });
}
