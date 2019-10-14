import {Get, Has} from "../components/com_index.js";
import {Entity, Game} from "../game.js";

const QUERY = Has.Transform | Has.Lifespan;

export function sys_lifespan(game: Game, delta: number) {
    for (let i = 0; i < game.World.length; i++) {
        if ((game.World[i] & QUERY) == QUERY) {
            update(game, i, delta);
        }
    }
}

function update(game: Game, entity: Entity, delta: number) {
    let lifespan = game[Get.Lifespan][entity];
    lifespan.Age += delta;
    if (lifespan.Age > lifespan.Max) {
        game.Destroy(entity);
    }
}
