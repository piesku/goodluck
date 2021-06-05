import {Entity, Game} from "./game.js";
import {Has} from "./world.js";

export const enum Action {
    ToggleFullscreen,
    CollectItem,
}

export function dispatch(game: Game, action: Action, payload: unknown) {
    switch (action) {
        case Action.ToggleFullscreen: {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.body.requestFullscreen();
            }
            break;
        }
        case Action.CollectItem: {
            let [item_entity] = payload as [Entity, Entity];
            game.World.Signature[item_entity] |= Has.Lifespan;
            game.World.Lifespan[item_entity].Remaining = 0;
            break;
        }
    }
}
