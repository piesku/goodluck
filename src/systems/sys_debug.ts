import {Collide} from "../components/com_collide.js";
import {Get, Has} from "../components/com_index.js";
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
            !(game.World[wireframe.entity] & Has.Transform) ||
            // ...or if it's not the same TRANSFORM.
            game[Get.Transform][wireframe.entity] !== wireframe.anchor
        ) {
            game.Destroy(wireframe.transform.EntityId);
            wireframes.delete(key);
        }
    }

    for (let i = 0; i < game.World.length; i++) {
        if (game.World[i] & Has.Transform) {
            // Draw colliders first. If the collider's wireframe overlaps
            // exactly with the transform's wireframe, we want the collider to
            // take priority.
            if (game.World[i] & Has.Collide) {
                wireframe_collider(game, i);
            }

            // Draw invisible entities.
            if (!(game.World[i] & Has.Render)) {
                wireframe_entity(game, i);
            }
        }
    }
}

function wireframe_entity(game: Game, entity: Entity) {
    let entity_transform = game[Get.Transform][entity];
    let wireframe = wireframes.get(entity_transform);

    if (!wireframe) {
        let box = game.Add({
            Using: [render_basic(game.Materials[Mat.Wireframe], Cube, [1, 0, 1, 1])],
        });
        let wireframe_transform = game[Get.Transform][box];
        wireframe_transform.World = entity_transform.World;
        wireframe_transform.Dirty = false;
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
        let box = game.Add({
            Translation: collide.Center,
            Scale: scale([0, 0, 0], collide.Half, 2),
            Using: [render_basic(game.Materials[Mat.Wireframe], Cube, [0, 1, 0, 1])],
        });
        wireframes.set(collide, {
            entity,
            anchor: transform,
            transform: game[Get.Transform][box],
        });
    } else if (collide.Dynamic) {
        wireframe.transform.Translation = collide.Center;
        scale(wireframe.transform.Scale, collide.Half, 2);
        wireframe.transform.Dirty = true;
    }
}
