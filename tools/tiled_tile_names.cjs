const {readFileSync} = require("fs");

let args = process.argv.slice(2);
if (args.length !== 1) {
    console.error("Generate names of tiles from a Tiled tileset (.tsj).");
    console.error("  node tiled_tile_names.cjs atlas.tsj");
    process.exit(1);
}

let tileset_path = args.pop();
let tileset_file = readFileSync("./" + tileset_path);
let tileset = JSON.parse(tileset_file);

for (let tile of tileset.tiles) {
    console.log(tile.image);
}
