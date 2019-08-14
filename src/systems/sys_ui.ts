import {Game} from "../game.js";
import {App} from "../ui/App.js";

let root = document.querySelector("main")!;
let prev: string;

export function sys_ui(game: Game, delta: number) {
    let next = App(game.ui);
    if (next !== prev) {
        root.innerHTML = prev = next;
    }
}
