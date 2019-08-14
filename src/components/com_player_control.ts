import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface PlayerControl {
    readonly move: boolean;
    readonly pitch: boolean;
    readonly yaw: boolean;
}

export function player_control(move: boolean, yaw: boolean, pitch: boolean) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.PlayerControl;
        game[Get.PlayerControl][entity] = <PlayerControl>{move, yaw, pitch};
    };
}
