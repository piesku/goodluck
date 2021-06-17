import {Vec4} from "../../common/math.js";
import {Mesh} from "../../common/mesh.js";
import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export type Pickable = PickableMesh | PickableAABB;

export const enum PickableKind {
    Mesh,
    AABB,
}

export interface PickableMesh {
    Kind: PickableKind.Mesh;
    Mesh: Mesh;
}

export function pickable_mesh(mesh: Mesh) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Pickable;
        game.World.Pickable[entity] = {
            Kind: PickableKind.Mesh,
            Mesh: mesh,
        };
    };
}

export interface PickableAABB {
    Kind: PickableKind.AABB;
    Color: Vec4;
}

export function pickable_aabb(color: Vec4) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Pickable;
        game.World.Pickable[entity] = {
            Kind: PickableKind.AABB,
            Color: color,
        };
    };
}
