import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface PlayerControl {
    readonly Move: boolean;
    readonly Pitch: boolean;
    readonly Yaw: boolean;
}

export function player_control(Move: boolean, Yaw: boolean, Pitch: boolean) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= 1 << Get.PlayerControl;
        game[Get.PlayerControl][entity] = <PlayerControl>{
            Move,
            Yaw,
            Pitch,
        };
    };
}
