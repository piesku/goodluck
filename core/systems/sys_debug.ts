import {instantiate} from "../../common/game.js";
import {scale} from "../../common/vec3.js";
import {Entity} from "../../common/world.js";
import {Collide} from "../components/com_collide.js";
import {RenderKind, render_colored_unlit} from "../components/com_render.js";
import {transform, Transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

interface Wireframe {
    entity: Entity;
    transform: Transform;
    anchor_entity: Entity;
    anchor_transform: Transform;
}
const wireframes: Map<Transform | Collide, Wireframe> = new Map();

export function sys_debug(game: Game, delta: number) {
    // Prune wireframes corresponding to destroyed entities.
    for (let [key, wireframe] of wireframes) {
        if (
            // If the entity doesn't have TRANSFORM...
            !(game.World.Signature[wireframe.anchor_entity] & Has.Transform) ||
            // ...or if it's not the same TRANSFORM.
            game.World.Transform[wireframe.anchor_entity] !== wireframe.anchor_transform
        ) {
            game.World.DestroyEntity(wireframe.entity);
            wireframes.delete(key);
        }
    }

    for (let i = 0; i < game.World.Signature.length; i++) {
        if (game.World.Signature[i] & Has.Transform) {
            // Draw colliders first. If the collider's wireframe overlaps
            // exactly with the transform's wireframe, we want the collider to
            // take priority.
            if (game.World.Signature[i] & Has.Collide) {
                wireframe_collider(game, i);
            }

            // Draw invisible entities.
            if (!(game.World.Signature[i] & Has.Render)) {
                wireframe_invisible(game, i);
            }
        }
    }
}

function wireframe_invisible(game: Game, entity: Entity) {
    let anchor_transform = game.World.Transform[entity];
    let wireframe = wireframes.get(anchor_transform);

    if (!wireframe) {
        let wireframe_entity = instantiate(game, [
            transform(),
            render_colored_unlit(game.MaterialWireframe, game.MeshCube, [1, 0, 1, 1]),
        ]);
        let wireframe_transform = game.World.Transform[wireframe_entity];
        wireframe_transform.World = anchor_transform.World;
        game.World.Signature[wireframe_entity] &= ~Has.Dirty;
        wireframes.set(anchor_transform, {
            entity: wireframe_entity,
            transform: wireframe_transform,
            anchor_entity: entity,
            anchor_transform: anchor_transform,
        });
    }
}

function wireframe_collider(game: Game, entity: Entity) {
    let anchor_transform = game.World.Transform[entity];
    let anchor_collide = game.World.Collide[entity];

    let wireframe = wireframes.get(anchor_collide);
    if (!wireframe) {
        let wireframe_entity = instantiate(game, [
            transform(anchor_collide.Center, undefined, scale([0, 0, 0], anchor_collide.Half, 2)),
            render_colored_unlit(game.MaterialWireframe, game.MeshCube, [0, 1, 0, 1]),
        ]);
        wireframe = {
            entity: wireframe_entity,
            transform: game.World.Transform[wireframe_entity],
            anchor_entity: entity,
            anchor_transform: anchor_transform,
        };
        wireframes.set(anchor_collide, wireframe);
    }

    if (anchor_collide.Dynamic) {
        wireframe.transform.Translation = anchor_collide.Center;
        scale(wireframe.transform.Scale, anchor_collide.Half, 2);
        game.World.Signature[wireframe.entity] |= Has.Dirty;
    }

    let render = game.World.Render[wireframe.entity];
    if (render.Kind === RenderKind.ColoredUnlit) {
        if (anchor_collide.Collisions.length > 0) {
            render.Color[2] = 1;
        } else {
            render.Color[2] = 0;
        }
    }
}
