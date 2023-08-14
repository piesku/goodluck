import {Mesh} from "./mesh.js";
import {create_spritesheet_from, create_texture_from, fetch_image, Spritesheet} from "./texture.js";

/**
 * Asynchronously load a texture.
 *
 *     let game = new Game();
 *     Promise.all([
 *         load_texture(game, "Bricks059_1K_Color.jpg"),
 *         load_texture(game, "Bricks059_1K_Normal.jpg"),
 *         load_texture(game, "Bricks059_1K_Roughness.jpg"),
 *     ]).then(() => {
 *         scene_stage(game);
 *         game.Start();
 *     });
 */
export async function load_texture(
    game: {
        Gl: WebGL2RenderingContext;
        Textures: Record<string, WebGLTexture>;
    },
    name: string,
) {
    let image = await fetch_image("../textures/" + name + ".webp");
    game.Textures[name] = create_texture_from(game.Gl, image);
}

/**
 * Asynchronously load a spritesheet.
 *
 * The spritesheet will be uploaded to the GPU without mipmaps and using only
 * GL_NEAREST for scaling.
 */
export async function load_spritesheet(
    game: {
        Gl: WebGL2RenderingContext;
        Spritesheets: Record<string, Spritesheet>;
    },
    name: string,
) {
    let image = await fetch_image("../sprites/" + name + ".webp");
    game.Spritesheets[name] = create_spritesheet_from(game.Gl, image);
}

/**
 * Asynchronously load a mesh.
 *
 * The mesh file must be transpiled to JavaScript in a separate build step.
 *
 *     let game = new Game();
 *     Promise.all([
 *         load_mesh("monkey_flat"),
 *         load_mesh("monkey_smooth")
 *     ]).then(() => {
 *         scene_stage(game);
 *         game.Start();
 *     });
 */
export async function load_mesh(
    game: {
        Gl: WebGL2RenderingContext;
        Meshes: Record<string, Mesh>;
        Ui: HTMLElement;
    },
    name: string,
) {
    let module = await import("../meshes/" + name + ".js");
    game.Meshes[name] = module["mesh_" + name](game.Gl);

    // Report loading progress.
    game.Ui.innerHTML += `Loading <code>${name}</code>... ✓<br>`;
}
