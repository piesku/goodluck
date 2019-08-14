import {Collide} from "../components/com_collide.js";
import {Get} from "../components/com_index.js";
import {render_basic} from "../components/com_render_basic.js";
import {Transform} from "../components/com_transform.js";
import {Entity, Game} from "../game.js";
import {Mat} from "../materials/mat_index.js";
import {scale} from "../math/vec3.js";
import {Cube} from "../shapes/Cube.js";

interface Wireframe {
    entity: Entity;
    anchor: Transform;
    transform: Transform;
}
const wireframes: Map<Transform | Collide, Wireframe> = new Map();

export function sys_debug(game: Game, delta: number) {
    // Prune wireframes corresponding to destroyed entities.
    for (let [key, wireframe] of wireframes) {
        if (
            // If the entity doesn't have TRANSFORM...
            !(game.world[wireframe.entity] & (1 << Get.Transform)) ||
            // ...or if it's not the same TRANSFORM.
            game[Get.Transform][wireframe.entity] !== wireframe.anchor
        ) {
            game.destroy(wireframe.transform.entity);
            wireframes.delete(key);
        }
    }

    for (let i = 0; i < game.world.length; i++) {
        if (game.world[i] & (1 << Get.Transform)) {
            // Draw colliders first. If the collider's wireframe overlaps
            // exactly with the transform's wireframe, we want the collider to
            // take priority.
            if (game.world[i] & (1 << Get.Collide)) {
                wireframe_collider(game, i);
            }

            // Draw invisible entities.
            if (!(game.world[i] & (1 << Get.Render))) {
                wireframe_entity(game, i);
            }
        }
    }
}

function wireframe_entity(game: Game, entity: Entity) {
    let entity_transform = game[Get.Transform][entity];
    let wireframe = wireframes.get(entity_transform);

    if (!wireframe) {
        let box = game.add({
            using: [render_basic(game.materials[Mat.Wireframe], Cube, [1, 0, 1, 1])],
        });
        let wireframe_transform = game[Get.Transform][box];
        wireframe_transform.world = entity_transform.world;
        wireframe_transform.dirty = false;
        wireframes.set(entity_transform, {
            entity,
            anchor: entity_transform,
            transform: wireframe_transform,
        });
    }
}

function wireframe_collider(game: Game, entity: Entity) {
    let transform = game[Get.Transform][entity];
    let collide = game[Get.Collide][entity];
    let wireframe = wireframes.get(collide);

    if (!wireframe) {
        let box = game.add({
            translation: collide.center,
            scale: scale([], collide.half, 2),
            using: [render_basic(game.materials[Mat.Wireframe], Cube, [0, 1, 0, 1])],
        });
        wireframes.set(collide, {
            entity,
            anchor: transform,
            transform: game[Get.Transform][box],
        });
    } else if (collide.dynamic) {
        wireframe.transform.translation = collide.center;
        scale(wireframe.transform.scale, collide.half, 2);
        wireframe.transform.dirty = true;
    }
}
