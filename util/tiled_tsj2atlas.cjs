/**
 * # Tiled TSJ to Atlas
 *
 * Convert a Tiled tileset JSON file to an atlas definition in TypeScript.
 *
 * The converter assumes that the atlas image file is a vertical strip of tiles,
 * with 1px padding in each direction to prevent bleeding.
 *
 * ## Usage
 *
 * Note: this utility only creates the atlas definition as a TypeScript source
 * file. You still need to create the atlas image file:
 * `src/sprites/atlas.png.webp` and include it in `src/index.html` and in
 * `play/game.html`:
 *
 *     <img hidden src="./sprites/atlas.png.webp">
 *
 * It's recommended to use the Makefile found in the `src/sprites` directory to
 * create the atlas image file and the atlas definition at once:
 *
 *     make -C src/sprites
 *
 * ## Supported Tiled Features
 *
 * Create a tileset in Tiled and save it as TSJ (which is JSON). Choose `Type:
 * Collection of Images` and leave `Embed in map` unchecked.
 *
 * The converter supports the following features:
 *
 * - Tiles of different sizes.
 * - Animated tiles.
 * - Collision tiles via the custom `Collision` property.
 *
 * ## Optimization Tips
 *
 * If all tiles are the same size, you can remove the `w` and `h` properties
 * from the atlas, and hard-code the size in the [`render2d`](com_render2d.html)
 * component.
 *
 * As long as the tilesheet image is a vertical strip of tiles, you can remove
 * the `x` property from the atlas.
 *
 * It's also possible to hack the ids of the tiles in Tiled to make them
 * sequential, modify the atlas structure to be an array, and refer to tiles by
 * index instead of the `id` key.
 */

const {readFileSync} = require("fs");

let args = process.argv.slice(2);
if (args.length !== 1) {
    console.error("Generate an atlas description from a Tiled tileset (.tsj).");
    console.error("  node tiled_tsj2atlas.cjs atlas.tsj");
    process.exit(1);
}

let tileset_path = args.pop();
let tileset_file = readFileSync("./" + tileset_path);
let tileset = JSON.parse(tileset_file);

let sprites = {};
let y = 1;

for (let tile of tileset.tiles) {
    sprites[tile.id] = {
        x: 1,
        y: y,
        w: tile.imagewidth,
        h: tile.imageheight,
    };
    y += tile.imageheight + 2;

    if (tile.animation) {
        sprites[tile.id].a = {};
        for (let frame of tile.animation) {
            sprites[tile.id].a[frame.tileid] = frame.duration / 1000;
        }
    }

    if (tile.properties) {
        let collide_prop = tile.properties.find((x) => x.name === "Collision");
        if (collide_prop) {
            sprites[tile.id].c = collide_prop.value;
        }
    }
}

console.log(`// prettier-ignore
export const atlas: {
    [id: string]: {
        x: number,
        y: number,
        w: number,
        h: number,
        a?: Record<string, number>,
        c?: boolean,
    }
} = ${JSON.stringify(sprites, null, 4)};`);
