import {Game} from "./game.js";

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
