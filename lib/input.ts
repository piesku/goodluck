import {GameImpl} from "./game";
import {Vec2} from "./math";

export function input_pointer_lock(game: GameImpl) {
    game.Ui.addEventListener("click", () => game.Ui.requestPointerLock());
}

export function pointer_down(game: GameImpl, mouse_button: number, touch_id = mouse_button) {
    return game.InputState["Mouse" + mouse_button] > 0 || game.InputState["Touch" + touch_id] > 0;
}

export function pointer_clicked(game: GameImpl, mouse_button: number, touch_id = mouse_button) {
    return (
        (game.InputDelta["Mouse" + mouse_button] === -1 &&
            game.InputDistance["Mouse" + mouse_button] < 5) ||
        (game.InputDelta["Touch" + touch_id] === -1 && game.InputDistance["Touch" + touch_id] < 5)
    );
}

export function pointer_viewport(game: GameImpl, out: Vec2): boolean {
    if (game.InputState["Touch0"] === 1 || game.InputDelta["Touch0"] === -1) {
        out[0] = game.InputState["Touch0X"];
        out[1] = game.InputState["Touch0Y"];
        return true;
    }

    if (game.InputDistance["Mouse"] > 0) {
        out[0] = game.InputState["MouseX"];
        out[1] = game.InputState["MouseY"];
        return true;
    }

    // No mouse, no touch.
    return false;
}
