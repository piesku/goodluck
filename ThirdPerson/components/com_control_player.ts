import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";

export interface ControlPlayer {
    readonly Move: boolean;
    readonly Pitch: boolean;
    readonly Yaw: boolean;
    CurrentPitch: number;
}

export function control_player(Move: boolean, Yaw: boolean, Pitch: boolean) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.ControlPlayer;
        game.World.ControlPlayer[entity] = <ControlPlayer>{
            Move,
            Yaw,
            Pitch,
            CurrentPitch: 0,
        };
    };
}
