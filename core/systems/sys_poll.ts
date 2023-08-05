/**
 * # sys_task
 *
 * Complete [tasks](com_task.html) whose ready condition has been satisifed.
 *
 * Additionally, if a task has a [`Children`](com_children.html) component,
 * child tasks block the parent task from completing. When all children
 * complete, the parent task is completed on the next frame. This is done for
 * consistency, to make `sys_poll` independent of the order in which tasks are
 * added to the world.
 */

import {Entity, destroy_entity} from "../../lib/world.js";
import {TaskKind} from "../components/com_task.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

const QUERY = Has.Task;

export function sys_poll(game: Game, delta: number) {
    // Collect all ready tasks first to avoid completing them while we stil
    // iterate over other tasks. This guarantees that tasks blocked by other
    // tasks will be completed deterministically in the next frame.
    let tasks_to_complete: Array<Entity> = [];

    for (let ent = 0; ent < game.World.Signature.length; ent++) {
        if ((game.World.Signature[ent] & QUERY) === QUERY) {
            if (has_blocking_dependencies(game.World, ent)) {
                continue;
            }

            let task = game.World.Task[ent];
            switch (task.Kind) {
                case TaskKind.When: {
                    if (task.Predicate(ent)) {
                        tasks_to_complete.push(ent);
                    }
                    break;
                }
                case TaskKind.Delay: {
                    task.Remaining -= delta;
                    if (task.Remaining < 0) {
                        tasks_to_complete.push(ent);
                    }
                    break;
                }
                case TaskKind.Then: {
                    tasks_to_complete.push(ent);
                    break;
                }
            }
        }
    }

    for (let ent of tasks_to_complete) {
        let task = game.World.Task[ent];
        switch (task.Kind) {
            case TaskKind.Then:
                task.Callback(ent);
            case TaskKind.When:
            case TaskKind.Delay:
                destroy_entity(game.World, ent);
        }

        // Delete component data to avoid memory leaks from closures.
        delete game.World.Task[ent];
    }
}

function has_blocking_dependencies(world: World, entity: Entity) {
    if (world.Signature[entity] & Has.Children) {
        let children = world.Children[entity];
        for (let child of children.Children) {
            if (world.Signature[child] & Has.Task) {
                // A pending child blocks the parent task.
                return true;
            }
        }
    }

    return false;
}
