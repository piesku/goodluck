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

if (tiled_map.renderorder !== "right-up") {
    console.error("Map must be saved using the right-up render order in Tiled.");
    process.exit(1);
}

let map = {
    Width: tiled_map.width,
    Height: tiled_map.height,
    Layers: [],
    BackgroundColor: tiled_map.backgroundcolor,
};

for (let tiled_layer of tiled_map.layers) {
    map.Layers.push({
        Data: tiled_layer.data,
        Width: tiled_layer.width,
        Height: tiled_layer.height,
    });
}

let map_name = positionals[0].replace(/\.tmj$/, "");
console.log(`// prettier-ignore
export const ${map_name} = ${JSON.stringify(map)};`);
