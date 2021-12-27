import {instantiate} from "../../common/game.js";
import {draw_rect} from "../components/com_draw.js";
import {transform2d} from "../components/com_transform2d.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();

    instantiate(game, [
        transform2d([game.ViewportWidth / 2, game.ViewportHeight / 2]),
        draw_rect(200, 100, "red"),
    ]);
}
