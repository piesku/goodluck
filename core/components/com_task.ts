/**
 * # Task
 *
 * The `Task` component is used to schedule tasks to be executed at a later time.
 *
 * A task can either complete when a predicate is met, or after a certain amount
 * of time has passed, or as soon as possible. The Children component can be
 * additionally used to create dependencies between tasks, with child tasks
 * blocking the parent.
 *
 *     instantiate(game, [
 *         // 3. Then run do_something().
 *         task_then(() => do_something()),
 *         children([
 *             // 2. Then wait for 10 seconds.
 *             task_delay(10),
 *             children([
 *                 // 1. First wait for is_something_true() to return true.
 *                 task_when(() => is_something_true()),
 *             ]),
 *         ]),
 *     ]);
 *
 * When a task completes, its entity is destroyed. For this reason, when adding
 * tasks to entities which represent game objects, don't mix them with other
 * components; add them as children instead.
 *
 *     instantiate(game, [
 *         transform(...),
 *         render(...),
 *         control_player(...),
 *         children([
 *             // This child entity is safe to destroy after the task completes.
 *             task_then(() => do_something()),
 *             children([
 *                 task_delay(10),
 *             ]),
 *         ]),
 *     ]);
 */

import {Entity} from "../../lib/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export type Task = TaskWhen | TaskDelay | TaskThen;

export const enum TaskKind {
    When,
    Delay,
    Then,
}

type Predicate = (entity: Entity) => boolean;
type Callback = (entity: Entity) => void;

export interface TaskWhen {
    Kind: TaskKind.When;
    Predicate: Predicate;
}

/**
 * Add a `Task` which completes when the predicate returns `true`.
 *
 * If the task entity has any task children (dependencies), they must
 * complete before the predicate is evaluated for the first time.
 *
 * @param predicate The predicate to evaluate every frame.
 */
export function task_when(predicate: Predicate) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Task;
        game.World.Task[entity] = {
            Kind: TaskKind.When,
            Predicate: predicate,
        };
    };
}

export interface TaskDelay {
    Kind: TaskKind.Delay;
    Remaining: number;
}

/**
 * Add a `Task` which completes after the specified duration (in seconds).
 *
 * If the task entity has any task children (dependencies), they must
 * complete before the timer is started.
 *
 * @param duration The duration of the delay in seconds.
 */
export function task_delay(duration: number) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Task;
        game.World.Task[entity] = {
            Kind: TaskKind.Delay,
            Remaining: duration,
        };
    };
}

export interface TaskThen {
    Kind: TaskKind.Then;
    Callback: Callback;
}

/**
 * Add a `Task` which completes as soon as possible.
 *
 * If the task entity has any task children (dependencies), they must
 * complete before this task can complete.
 *
 * @param callback The function to run when the task completes.
 */
export function task_then(callback: Callback) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Task;
        game.World.Task[entity] = {
            Kind: TaskKind.Then,
            Callback: callback,
        };
    };
}
