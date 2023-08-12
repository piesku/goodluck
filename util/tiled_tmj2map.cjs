/**
 * # Tiled TMJ to Map
 *
 * Convert Tiled's JSON map representation to a TypeScript source file, which
 * can then be imported and used by the tiled.ts module to instantiate a map.
 *
 * ## Supported Tiled Features
 *
 * The following Tiled features are supported:
 *
 * - Map width and height
 * - Map background color
 * - Any number of tile layers
 * - Layer width and height
 *
 * Tiled's render order is ignored. The converter assumes the right-up order,
 * which is compatible with the directions of the world axes in the game.
 *
 * ## Tilesets
 *
 * Tiled encodes tile information by id. Use
 * [`tiled_tsj2atlas.cjs`](tiled_tsj2atlas.html) to convert Tiled's tileset JSON
 * to an atlas definition in TypeScript.
 *
 * ## Usage
 *
 * It's recommended to use the Makefile found in the `src/maps` directory to
 * convert all maps at once:
 *
 *     make -C src/maps
 */

const {readFileSync} = require("fs");
const {parseArgs} = require("util");

let {positionals} = parseArgs({
    allowPositionals: true,
});

if (positionals.length !== 1) {
    console.error("Convert Tiled's JSON format to a TypeScript source file.");
    console.error("  node tiled_tmj2map.cjs tiled.json > map.ts");
    process.exit(1);
}

let tiled_json = readFileSync(positionals[0], "utf8");
let tiled_map = JSON.parse(tiled_json);

let map = {
    Width: tiled_map.width,
    Height: tiled_map.height,
    Layers: [],
    BackgroundColor: tiled_map.backgroundcolor,
};

for (let tiled_layer of tiled_map.layers) {
    let data = [];

    // Convert a tile layer from right-down render order to right-up.
    for (let y = 0; y < tiled_layer.height; y++) {
        for (let x = 0; x < tiled_layer.width; x++) {
            data[y * tiled_layer.width + x] =
                tiled_layer.data[(tiled_layer.height - y - 1) * tiled_layer.width + x];
            data[(tiled_layer.height - y - 1) * tiled_layer.width + x] =
                tiled_layer.data[y * tiled_layer.width + x];
        }
    }

    map.Layers.push({
        Data: data,
        Width: tiled_layer.width,
        Height: tiled_layer.height,
    });
}

let map_name = positionals[0].replace(/\.tmj$/, "");
console.log(`// prettier-ignore
export const ${map_name} = ${JSON.stringify(map)};`);
