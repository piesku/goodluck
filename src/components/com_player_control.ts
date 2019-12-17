import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export interface PlayerControl {
    readonly Move: boolean;
    readonly Pitch: boolean;
    readonly Yaw: boolean;
}

export function player_control(Move: boolean, Yaw: boolean, Pitch: boolean) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.PlayerControl;
        game.World.PlayerControl[entity] = <PlayerControl>{
            Move,
            Yaw,
            Pitch,
        };
    };
}
