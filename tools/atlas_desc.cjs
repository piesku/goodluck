const {readFileSync} = require("fs");

let args = process.argv.slice(2);
if (args.length !== 1) {
    console.error("Generate an atlas description from a Tiled tileset (.tsj).");
    console.error("  node atlas_desc.cjs atlas.tsj");
    process.exit(1);
}

let tileset_path = args.pop();
let tileset_file = readFileSync("./" + tileset_path);
let tileset = JSON.parse(tileset_file);

let sprites = {};
let y = 0;

for (let tile of tileset.tiles) {
    sprites[tile.id] = {
        x: 0,
        y: y,
        w: tile.imagewidth,
        h: tile.imageheight,
    };
    y += tile.imageheight;

    if (tile.animation) {
        sprites[tile.id].a = {};
        for (let frame of tile.animation) {
            sprites[tile.id].a[frame.tileid] = frame.duration / 1000;
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
	}
} = ${JSON.stringify(sprites, null, 4)};
`);
