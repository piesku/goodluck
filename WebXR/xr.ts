import {Game} from "./game.js";

export async function xr_init(game: Game) {
    game.XrSupported = await navigator.xr.isSessionSupported("immersive-vr");
}

export async function xr_enter(game: Game) {
    let session = await navigator.xr.requestSession("immersive-vr");
    session.updateRenderState({
        baseLayer: new XRWebGLLayer(session, game.Gl),
    });
    game.XrSpace = await session.requestReferenceSpace("local");

    game.Pause();
    game.XrSession = session;
    game.Resume();

    game.XrSession.addEventListener("end", () => {
        game.Pause();
        game.XrSession = undefined;
        game.XrSpace = undefined;
        game.XrFrame = undefined;
        game.ViewportResized = true;
        game.Resume();
    });
}
