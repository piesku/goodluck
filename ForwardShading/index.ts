import {create_texture_from, fetch_image} from "../common/texture.js";
import {Game} from "./game.js";
import {scene_stage} from "./scenes/sce_stage.js";

let game = new Game();

// @ts-ignore
window.game = game;

Promise.all([
    load_texture(game, "Bricks059_1K_Color.jpg"),
    load_texture(game, "Bricks059_1K_Normal.jpg"),
    load_texture(game, "Bricks059_1K_Roughness.jpg"),

    load_texture(game, "Sponge001_1K_Color.jpg"),
    load_texture(game, "Sponge001_1K_Normal.jpg"),
    load_texture(game, "Sponge001_1K_Roughness.jpg"),

    load_texture(game, "Wood063_1K_Color.jpg"),
    load_texture(game, "Wood063_1K_Normal.jpg"),
    load_texture(game, "Wood063_1K_Roughness.jpg"),

    load_texture(game, "Concrete018_1K_Color.jpg"),
    load_texture(game, "Concrete018_1K_Normal.jpg"),
    load_texture(game, "Concrete018_1K_Roughness.jpg"),
]).then(() => {
    scene_stage(game);
    game.Start();
});

async function load_texture(game: Game, name: string) {
    let image = await fetch_image("../textures/" + name + ".webp");
    game.Textures[name] = create_texture_from(game.Gl, image);
}
