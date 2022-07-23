import {GameImpl} from "./game";
import {Vec2} from "./math";

export function input_pointer_lock(game: GameImpl) {
    game.Ui.addEventListener("click", () => game.Ui.requestPointerLock());
}

export function pointer_down(game: GameImpl, mouse_button: number, touch_id = mouse_button) {
    return game.InputState["Mouse" + mouse_button] || game.InputState["Touch" + touch_id];
}

export function pointer_clicked(game: GameImpl, mouse_button: number, touch_id = mouse_button) {
    return (
        (game.InputDelta["Mouse" + mouse_button] === -1 &&
            game.InputDistance["Mouse" + mouse_button] < 10) ||
        (game.InputDelta["Touch" + touch_id] === -1 && game.InputDistance["Touch" + touch_id] < 10)
    );
}

export function pointer_viewport(game: GameImpl): Vec2 | null {
    if (game.InputState["Touch0"] === 1 || game.InputDelta["Touch0"] === -1) {
        return [game.InputState["Touch0X"], game.InputState["Touch0Y"]];
    }

    if (game.InputDistance["Mouse"] > 0) {
        return [game.InputState["MouseX"], game.InputState["MouseY"]];
    }

    // No mouse, no touch.
    return null;
}
