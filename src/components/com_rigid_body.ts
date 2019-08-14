import {Entity, Game} from "../game.js";
import {Get} from "./com_index.js";

export interface RigidBody {
    readonly dynamic: boolean;
    vy: number;
    ay: number;
}

export function rigid_body(dynamic: boolean = true) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.RigidBody;
        game[Get.RigidBody][entity] = <RigidBody>{dynamic, vy: 0, ay: 0};
    };
}
