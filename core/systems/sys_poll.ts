/**
 * @module systems/sys_poll
 */

import {Entity} from "../../common/world.js";
import {TaskKind} from "../components/com_task.js";
import {Game} from "../game.js";
import {Has, World} from "../world.js";

const QUERY = Has.Task;

export function sys_poll(game: Game, delta: number) {
    // Collect all ready tasks first to avoid completing them while we stil
    // literate over ohter tasks. This guarantees that tasks blocked by other
    // tasks will be completed during the next frame.
    let tasks_to_complete: Array<Entity> = [];

    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            if (has_blocking_dependencies(game.World, i)) {
                continue;
            }

            let task = game.World.Task[i];
            switch (task.Kind) {
                case TaskKind.Until: {
                    if (task.Predicate(i)) {
                        tasks_to_complete.push(i);
                    }
                    break;
                }
                case TaskKind.Timeout: {
                    task.Remaining -= delta;
                    if (task.Remaining < 0) {
                        tasks_to_complete.push(i);
                    }
                    break;
                }
            }
        }
    }

    for (let entity of tasks_to_complete) {
        let task = game.World.Task[entity];
        if (task.OnDone) {
            task.OnDone(entity);
        }

        game.World.Signature[entity] &= ~Has.Task;
        if (game.World.Signature[entity] === Has.None) {
            // Task was the last component on the entity.
            game.World.DestroyEntity(entity);
        }

        // Explicitly delete the component data for this task to avoid memory
        // leaks from closures.
        delete game.World.Task[entity];
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
