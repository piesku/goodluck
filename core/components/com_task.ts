/**
 * @module components/com_task
 */

import {Entity} from "../../common/world.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

export type Task = TaskUntil | TaskTimeout;

export const enum TaskKind {
    Until,
    Timeout,
}

type Predicate = (entity: Entity) => boolean;
type Callback = (entity: Entity) => void;

export interface TaskUntil {
    Kind: TaskKind.Until;
    Predicate: Predicate;
    OnDone?: Callback;
}

/** A task that completes when the predicate returns true. */
export function task_until(predicate: Predicate, on_done?: Callback) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Task;
        game.World.Task[entity] = {
            Kind: TaskKind.Until,
            Predicate: predicate,
            OnDone: on_done,
        };
    };
}

export interface TaskTimeout {
    Kind: TaskKind.Timeout;
    Remaining: number;
    OnDone?: Callback;
}

/** A task that completes after the specified duration (in seconds). */
export function task_timeout(duration: number, on_done?: Callback) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Task;
        game.World.Task[entity] = {
            Kind: TaskKind.Timeout,
            Remaining: duration,
            OnDone: on_done,
        };
    };
}

/** A task that completes as soon as possible. */
export function task_complete(on_done: Callback) {
    return (game: Game, entity: Entity) => {
        game.World.Signature[entity] |= Has.Task;
        game.World.Task[entity] = {
            Kind: TaskKind.Timeout,
            Remaining: 0,
            OnDone: on_done,
        };
    };
}
