import {Entity, Game} from "../game.js";
import {Get, Has} from "./com_index.js";

export interface RigidBody {
    readonly Dynamic: boolean;
    VelY: number;
    AccY: number;
}

export function rigid_body(Dynamic: boolean = true) {
    return (game: Game, entity: Entity) => {
        game.World[entity] |= Has.RigidBody;
        game[Get.RigidBody][entity] = <RigidBody>{Dynamic, VelY: 0, AccY: 0};
    };
}
