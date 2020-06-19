import {Quat, Vec3} from "../common/math.js";
import {transform} from "./components/com_transform.js";
import {Entity, Game} from "./game.js";
import {Has, World} from "./world.js";

const MAX_ENTITIES = 10000;

let raf = 0;

export function loop_start(game: Game) {
    let last = performance.now();

    function tick(now: number, frame?: XRFrame) {
        let delta = (now - last) / 1000;
        last = now;

        if (frame) {
            game.XrFrame = frame;
            raf = game.XrFrame.session.requestAnimationFrame(tick);
        } else {
            game.XrFrame = undefined;
            raf = requestAnimationFrame(tick);
        }

        game.FrameUpdate(delta);
        game.FrameReset();
    }

    if (game.XrSession) {
        raf = game.XrSession.requestAnimationFrame(tick);
    } else {
        raf = requestAnimationFrame(tick);
    }
}

export function loop_stop(game: Game) {
    if (game.XrSession) {
        game.XrSession.cancelAnimationFrame(raf);
    } else {
        cancelAnimationFrame(raf);
    }
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
    Children?: Array<Blueprint>;
}

export function instantiate(
    game: Game,
    {Translation, Rotation, Scale, Using = [], Children = []}: Blueprint
) {
    let entity = create(game.World);
    transform(Translation, Rotation, Scale)(game, entity);
    for (let mixin of Using) {
        mixin(game, entity);
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

export async function xr_init(game: Game) {
    game.XrSupported = await navigator.xr.isSessionSupported("immersive-vr");
}

export async function xr_enter(game: Game) {
    let session = await navigator.xr.requestSession("immersive-vr");
    session.updateRenderState({
        baseLayer: new XRWebGLLayer(session, game.Gl),
    });
    game.XrSpace = await session.requestReferenceSpace("local");

    loop_stop(game);
    game.XrSession = session;
    loop_start(game);

    game.XrSession.addEventListener("end", () => {
        loop_stop(game);
        game.XrSession = undefined;
        game.XrSpace = undefined;
        game.XrFrame = undefined;
        game.ViewportResized = true;
        loop_start(game);
    });
}
