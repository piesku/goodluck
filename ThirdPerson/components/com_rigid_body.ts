import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface RigidBody {
    readonly Dynamic: boolean;
    VelY: number;
    AccY: number;
}

export function rigid_body(Dynamic: boolean = true) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.RigidBody;
        game.World.RigidBody[entity] = {
            Dynamic,
            VelY: 0,
            AccY: 0,
        };
    };
}
