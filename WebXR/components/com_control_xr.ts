import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

type Hand = "left" | "right";

export interface ControlXr {
    Hand: Hand;
}

export function control_xr(hand: Hand) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.ControlXr;
        game.World.ControlXr[entity] = {
            Hand: hand,
        };
    };
}
