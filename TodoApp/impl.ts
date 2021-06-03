import {Game} from "./game.js";

let raf = 0;

export function loop_start(game: Game) {
    let last = performance.now();

    let tick = (now: number) => {
        let delta = (now - last) / 1000;
        game.FrameUpdate(delta);
        last = now;
        raf = requestAnimationFrame(tick);
    };

    loop_stop();
    tick(last);
}

export function loop_stop() {
    cancelAnimationFrame(raf);
}
