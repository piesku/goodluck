import {Entity} from "../common/world.js";
import {destroy_all} from "./components/com_children.js";
import {Game} from "./game.js";

export const enum Action {
    ToggleFullscreen,
    CollectItem,
    ExpireItem,
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
            destroy_all(game.World, item_entity);
            game.ItemsCollected++;
            break;
        }
        case Action.ExpireItem: {
            game.ItemsMissed++;
            break;
        }
    }
}
