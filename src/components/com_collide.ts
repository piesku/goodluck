import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface Collide {
    readonly EntityId: Entity;
    New: boolean;
    /**
     * Dynamic colliders collide with all colliders. Static colliders collide
     * only with dynamic colliders.
     */
    Dynamic: boolean;
    /** The size of the collider in self units. */
    Size: [number, number, number];
    /** The world position of the AABB. */
    Center: Vec3;
    /** The half-extents of the AABB on the three axes. */
    Half: [number, number, number];
    /** Collisions detected with this collider during this tick. */
    Collisions: Array<Collision>;
}

export function collide(Dynamic: boolean = true, Size: [number, number, number] = [1, 1, 1]) {
    return (game: Game) => (EntityId: Entity) => {
        game.World[EntityId] |= 1 << Get.Collide;
        game[Get.Collide][EntityId] = <Collide>{
            EntityId,
            New: true,
            Dynamic,
            Size,
            Center: [0, 0, 0],
            Half: [0, 0, 0],
            Collisions: [],
        };
    };
}

export interface Collision {
    /** The other collider in the collision. */
    Other: Collide;
    /** The direction and magnitude of the hit from this collider's POV. */
    Hit: Vec3;
}