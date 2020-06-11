import {Quat, Vec3} from "../common/math.js";
import {transform} from "./components/com_transform.js";
import {Entity, Game} from "./game.js";
import {Has, World} from "./world.js";

const MAX_ENTITIES = 10000;

let raf = 0;

export function loop_start(game: Game) {
    let last = performance.now();

    let tick = (now: number) => {
        let delta = (now - last) / 1000;
        game.FrameUpdate(delta);
        game.FrameReset();
        last = now;
        raf = requestAnimationFrame(tick);
    };

    loop_stop();
    tick(last);
}

export function loop_stop() {
    cancelAnimationFrame(raf);
}

export function create(world: World, mask: number = 0) {
    for (let i = 0; i < MAX_ENTITIES; i++) {
        if (!world.Mask[i]) {
            world.Mask[i] = mask;
            return i;
        }
    }
    throw new Error("No more entities available.");
}

type Mixin = (game: Game, entity: Entity) => void;
export interface Blueprint {
    Translation?: Vec3;
    Rotation?: Quat;
    Scale?: Vec3;
    Using?: Array<Mixin>;
    Disable?: number;
    Children?: Array<Blueprint>;
}

export function instantiate(
    game: Game,
    {Translation, Rotation, Scale, Using = [], Disable, Children = []}: Blueprint
) {
    let entity = create(game.World);
    transform(Translation, Rotation, Scale)(game, entity);
    for (let mixin of Using) {
        mixin(game, entity);
    }
    if (Disable) {
        game.World.Mask[entity] &= ~Disable;
    }
    let entity_transform = game.World.Transform[entity];
    for (let subtree of Children) {
        let child = instantiate(game, subtree);
        let child_transform = game.World.Transform[child];
        child_transform.Parent = entity;
        entity_transform.Children.push(child);
    }
    return entity;
}

export function destroy(world: World, entity: Entity) {
    let mask = world.Mask[entity];
    if (mask & Has.Transform) {
        for (let child of world.Transform[entity].Children) {
            destroy(world, child);
        }
    }
    world.Mask[entity] = 0;
}
