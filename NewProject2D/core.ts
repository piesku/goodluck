import {Rad, Vec2} from "../common/math.js";
import {transform2d} from "./components/com_transform2d.js";
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
export interface Blueprint2D {
    Translation?: Vec2;
    Rotation?: Rad;
    Scale?: Vec2;
    Using?: Array<Mixin>;
    Children?: Array<Blueprint2D>;
}

export function instantiate(
    game: Game,
    {Translation, Rotation, Scale, Using = [], Children = []}: Blueprint2D
) {
    let entity = create(game.World);
    transform2d(Translation, Rotation, Scale)(game, entity);
    for (let mixin of Using) {
        mixin(game, entity);
    }
    let entity_transform = game.World.Transform2D[entity];
    for (let subtree of Children) {
        let child = instantiate(game, subtree);
        let child_transform = game.World.Transform2D[child];
        child_transform.Parent = entity;
        entity_transform.Children.push(child);
    }
    return entity;
}

export function destroy(world: World, entity: Entity) {
    let mask = world.Mask[entity];
    if (mask & Has.Transform2D) {
        for (let child of world.Transform2D[entity].Children) {
            destroy(world, child);
        }
    }
    world.Mask[entity] = 0;
}
