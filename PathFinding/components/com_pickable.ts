import {Mesh} from "../../common/material.js";
import {Entity, Game} from "../game.js";
import {Has} from "../world.js";

export interface Pickable {
    Mesh?: Mesh;
}

export function pickable(mesh?: Mesh) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Pickable;
        game.World.Pickable[entity] = {
            Mesh: mesh,
        };
    };
}
