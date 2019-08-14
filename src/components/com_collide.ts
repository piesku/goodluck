import {Entity, Game} from "../game.js";
import {Vec3} from "../math/index.js";
import {Get} from "./com_index.js";

export interface Collide {
    readonly entity: Entity;
    new: boolean;
    /**
     * Dynamic colliders collide with all colliders. Static colliders collide
     * only with dynamic colliders.
     */
    dynamic: boolean;
    /** The size of the collider in self units. */
    size: [number, number, number];
    /** The world position of the AABB. */
    center: Vec3;
    /** The half-extents of the AABB on the three axes. */
    half: [number, number, number];
    /** Collisions detected with this collider during this tick. */
    collisions: Array<Collision>;
}

export function collide(dynamic: boolean = true, size: [number, number, number] = [1, 1, 1]) {
    return (game: Game) => (entity: Entity) => {
        game.world[entity] |= 1 << Get.Collide;
        game[Get.Collide][entity] = <Collide>{
            entity,
            new: true,
            dynamic,
            size,
            center: [0, 0, 0],
            half: [0, 0, 0],
            collisions: [],
        };
    };
}

export interface Collision {
    /** The other collider in the collision. */
    other: Collide;
    /** The direction and magnitude of the hit from this collider's POV. */
    hit: Vec3;
}
