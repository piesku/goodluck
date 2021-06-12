import {GameImpl} from "./game";
import {Vec2} from "./math";

export function input_pointer_lock(game: GameImpl) {
    game.Ui.addEventListener("click", () => game.Ui.requestPointerLock());
}

export function input_clicked(game: GameImpl, mouse_button: number, touch_id: number) {
    return (
        (game.InputDelta["Mouse" + mouse_button] === -1 &&
            game.InputDistance["Mouse" + mouse_button] < 10) ||
        (game.InputDelta["Touch" + touch_id] === -1 && game.InputDistance["Touch" + touch_id] < 10)
    );
}

export function input_pointer_position(game: GameImpl): Vec2 | null {
    if (game.InputState["Touch0"] === 1 || game.InputDelta["Touch0"] === -1) {
        return [game.InputState["Touch0X"], game.InputState["Touch0Y"]];
    }

    if (game.InputDistance["Mouse"] > 0) {
        return [game.InputState["MouseX"], game.InputState["MouseY"]];
    }

    // No mouse, no touch.
    return null;
}
