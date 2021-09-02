import {Game} from "./game.js";

export async function xr_init(game: Game) {
    await game.Gl.makeXRCompatible();
    game.XrSupported = await navigator.xr.isSessionSupported("immersive-vr");
}

export async function xr_enter(game: Game) {
    let session = await navigator.xr.requestSession("immersive-vr");
    session.updateRenderState({
        baseLayer: new XRWebGLLayer(session, game.Gl),
    });
    game.XrSpace = await session.requestReferenceSpace("local");

    game.Stop();
    game.XrSession = session;
    game.Start();

    game.XrSession.addEventListener("end", () => {
        game.Stop();
        game.XrSession = undefined;
        game.XrSpace = undefined;
        game.XrFrame = undefined;
        game.ViewportResized = true;
        game.Start();
    });
}
