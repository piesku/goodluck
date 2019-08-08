import {Game} from "./game.js";
import {world_stage} from "./worlds/wor_stage.js";

export let game = new Game();

async function start() {
    world_stage(game);
    game.start();
}

start();
