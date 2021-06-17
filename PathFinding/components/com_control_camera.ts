0;
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export interface ControlCamera {
    Move: number;
    Zoom: number;
    Yaw: number;
    Pitch: number;
}

export function control_camera(move: number, zoom: number, yaw: number, pitch: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.ControlCamera;
        game.World.ControlCamera[entity] = {
            Move: move,
            Zoom: zoom,
            Yaw: yaw,
            Pitch: pitch,
        };
    };
}
