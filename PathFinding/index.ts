import {Game} from "./game.js";
import {scene_stage} from "./scenes/sce_stage.js";

let game = new Game();

// @ts-ignore
window.game = game;

Promise.all([load_mesh("cube"), load_mesh("terrain")]).then(() => {
    scene_stage(game);
    game.Start();
});

async function load_mesh(name: string) {
    let module = await import("../meshes/" + name + ".js");
    game.Meshes[name] = module["mesh_" + name](game.Gl);

    // Report loading progress.
    game.Ui.innerHTML += `Loading <code>${name}</code>... ✓<br>`;
}
